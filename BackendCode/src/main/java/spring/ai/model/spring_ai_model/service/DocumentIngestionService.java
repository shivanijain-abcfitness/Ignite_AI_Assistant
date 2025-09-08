package spring.ai.model.spring_ai_model.service;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;

@Service
public class DocumentIngestionService {
    private final Tika tika = new Tika();

    public String extractText(File file) throws IOException, TikaException
    {
        return tika.parseToString(file);
    }
}
