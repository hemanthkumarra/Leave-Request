package com.company.leaverequest.repository;

import com.company.leaverequest.model.LeaveRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LeaveRequestRepository extends MongoRepository<LeaveRequest, String> {
    List<LeaveRequest> findByEmployeeIdOrderByStartDateDesc(String employeeId);
    List<LeaveRequest> findAllByOrderByStartDateDesc();
}
