package taily_BE.Taily.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Post;
import taily_BE.Taily.entities.Report;
import taily_BE.Taily.exceptions.BadRequestException;
import taily_BE.Taily.exceptions.NotFoundException;
import taily_BE.Taily.exceptions.UnauthorizedException;
import taily_BE.Taily.payloads.ReportDTO;
import taily_BE.Taily.repositories.PostRepository;
import taily_BE.Taily.repositories.ReportRepository;
import taily_BE.Taily.tools.EmailSender;

import java.util.List;
import java.util.UUID;

@Service
public class ReportService {
    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private EmailSender emailSender;

    // POST
    public Report save(ReportDTO payload, DogOwner currentUser) {
        Post post = postRepository.findById(payload.postId())
                .orElseThrow(() -> new NotFoundException("Post non trovato"));
        if (post.getAuthor().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Non puoi segnalare il tuo stesso post!");
        }
        if (reportRepository.existsByAuthorAndPost(currentUser, post)) {
            throw new BadRequestException("Hai già segnalato questo post!");
        }

        Report newReport = new Report(payload.text(), currentUser, post);
        reportRepository.save(newReport);
        emailSender.sendReportEmail(currentUser);
        return newReport;
    }

    // GET ALL PAGINATED
    public Page<Report> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdInDate"));
        return reportRepository.findAll(pageable);
    }

    // DELETE
    public void deleteReport(UUID reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException("Segnalazione non trovata"));
        reportRepository.delete(report);
    }
}