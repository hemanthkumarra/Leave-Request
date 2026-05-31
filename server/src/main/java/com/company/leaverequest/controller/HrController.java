package com.company.leaverequest.controller;

import com.company.leaverequest.dto.StatusUpdateRequest;
import com.company.leaverequest.model.LeaveRequest;
import com.company.leaverequest.model.Status;
import com.company.leaverequest.repository.LeaveRequestRepository;
import com.company.leaverequest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr")
public class HrController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/leaves")
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {
        List<LeaveRequest> allRequests = leaveRequestRepository.findAllByOrderByStartDateDesc();
        for (LeaveRequest req : allRequests) {
            if (req.getEmployeeEmail() == null || req.getEmployeePhone() == null) {
                userRepository.findById(req.getEmployeeId()).ifPresent(user -> {
                    if (req.getEmployeeEmail() == null) req.setEmployeeEmail(user.getEmail());
                    if (req.getEmployeePhone() == null) req.setEmployeePhone(user.getPhoneNumber());
                });
            }
        }
        return ResponseEntity.ok(allRequests);
    }

    @PutMapping("/leaves/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(@PathVariable String id, @RequestBody StatusUpdateRequest statusUpdate) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with ID: " + id));

        try {
            Status status = Status.valueOf(statusUpdate.getStatus().toUpperCase());
            leaveRequest.setStatus(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Error: Invalid status value. Supported: ACCEPTED, REJECTED");
        }

        leaveRequest.setHrComments(statusUpdate.getHrComments());
        
        LeaveRequest updated = leaveRequestRepository.save(leaveRequest);
        return ResponseEntity.ok(updated);
    }
}
