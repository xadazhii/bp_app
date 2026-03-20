package com.xadazhii.server.services;

import com.xadazhii.server.models.Note;
import com.xadazhii.server.models.User;
import com.xadazhii.server.repository.NoteRepository;
import com.xadazhii.server.repository.UserRepository;
import com.xadazhii.server.storage.FileStorageStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@Transactional
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageStrategy fileStorage;

    public List<Note> myNotes(Long userId) {
        return noteRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Note createNote(Long userId, String content, String category, MultipartFile[] files) {
        User user = userRepository.findById(java.util.Objects.requireNonNull(userId))
                .orElseThrow(() -> new RuntimeException("Používateľ nebol nájdený"));

        String updatedContent = content;
        String firstImagePath = null;

        if (files != null && files.length > 0) {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                if (file != null && !file.isEmpty()) {
                    String ref = fileStorage.store(file);
                    if (firstImagePath == null) {
                        firstImagePath = ref;
                    }
                    updatedContent = updatedContent.replace("[[FILE_" + i + "]]", ref);
                }
            }
        }

        Note note = new Note(updatedContent, category, firstImagePath, user);
        return noteRepository.save(note);
    }

    public Note updateNote(Long userId, Long id, String content, String category, MultipartFile[] files) {
        Note note = noteRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Poznámka nebola nájdená"));

        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Chyba: Neautorizovaný prístup");
        }

        String updatedContent = content;
        String firstImagePath = note.getImagePath();

        if (files != null && files.length > 0) {
            int fileSlot = 0;
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    String ref = fileStorage.store(file);
                    if (fileSlot == 0) {
                        firstImagePath = ref;
                    }
                    updatedContent = updatedContent.replace("[[FILE_" + fileSlot + "]]", ref);
                    fileSlot++;
                }
            }
        }

        note.setContent(updatedContent);
        note.setCategory(category);
        note.setImagePath(firstImagePath);
        return noteRepository.save(note);
    }

    public void deleteNote(Long userId, Long id) {
        Note note = noteRepository.findById(java.util.Objects.requireNonNull(id))
                .orElseThrow(() -> new NoSuchElementException("Poznámka nebola nájdená"));

        if (!note.getUser().getId().equals(userId)) {
            throw new RuntimeException("Chyba: Neautorizovaný prístup");
        }

        if (note.getImagePath() != null) {
            fileStorage.delete(note.getImagePath());
        }

        noteRepository.delete(note);
    }
}
