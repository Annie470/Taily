package taily_BE.Taily.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Report;
import taily_BE.Taily.exceptions.ValidationException;
import taily_BE.Taily.payloads.ReportDTO;
import taily_BE.Taily.services.ReportService;
import java.util.UUID;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // POST
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.CREATED)
    public Report createReport(
            @RequestBody @Validated ReportDTO body,
            BindingResult validationResult,
            @AuthenticationPrincipal DogOwner currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }
        return reportService.save(body, currentUser);
    }

    // GET ALL PAGINATED
    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CHAIRMAN')")
    public Page<Report> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return reportService.findAll(page, size);
    }

    // DELETE
    @DeleteMapping("/{reportId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CHAIRMAN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReport(@PathVariable UUID reportId) {
        reportService.deleteReport(reportId);
    }
}