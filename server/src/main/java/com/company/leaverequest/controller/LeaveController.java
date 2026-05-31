package com.company.leaverequest.controller;

import com.company.leaverequest.dto.LeavePreviewRequest;
import com.company.leaverequest.dto.LeaveSubmitRequest;
import com.company.leaverequest.model.LeaveRequest;
import com.company.leaverequest.model.Status;
import com.company.leaverequest.model.User;
import com.company.leaverequest.repository.LeaveRequestRepository;
import com.company.leaverequest.repository.UserRepository;
import com.company.leaverequest.service.GeminiAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private GeminiAiService geminiAiService;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found."));
    }

    @PostMapping("/generate-preview")
    public ResponseEntity<?> generatePreview(@RequestBody LeavePreviewRequest previewRequest) {
        // Fallback to authenticated user's details if employee name is not supplied
        String employeeName = previewRequest.getEmployeeName();
        if (employeeName == null || employeeName.trim().isEmpty()) {
            User user = getAuthenticatedUser();
            employeeName = user.getUsername();
        }

        String letter = geminiAiService.generateLeaveLetter(
                employeeName,
                previewRequest.getStartDate(),
                previewRequest.getDays(),
                previewRequest.getBriefReason(),
                previewRequest.getHandoverPlan()
        );

        return ResponseEntity.ok(Collections.singletonMap("letter", letter));
    }

    @PostMapping
    public ResponseEntity<?> submitLeaveRequest(@RequestBody LeaveSubmitRequest submitRequest) {
        User user = getAuthenticatedUser();

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employeeId(user.getId())
                .employeeName(user.getUsername())
                .employeeEmail(user.getEmail())
                .employeePhone(user.getPhoneNumber())
                .startDate(submitRequest.getStartDate())
                .days(submitRequest.getDays())
                .briefReason(submitRequest.getBriefReason())
                .handoverPlan(submitRequest.getHandoverPlan())
                .aiGeneratedLetter(submitRequest.getAiGeneratedLetter())
                .status(Status.PENDING)
                .hrComments("")
                .build();

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<LeaveRequest>> getMyRequests() {
        User user = getAuthenticatedUser();
        List<LeaveRequest> requests = leaveRequestRepository.findByEmployeeIdOrderByStartDateDesc(user.getId());
        return ResponseEntity.ok(requests);
    }
}
