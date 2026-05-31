package com.company.leaverequest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "leave_requests")
public class LeaveRequest {
    @Id
    private String id;
    private String employeeId;
    private String employeeName;
    private String startDate;
    private int days;
    private String briefReason;
    private String handoverPlan;
    private String aiGeneratedLetter;
    private Status status;
    private String hrComments;
    private String employeeEmail;
    private String employeePhone;

    // Constructors
    public LeaveRequest() {}

    public LeaveRequest(String id, String employeeId, String employeeName, String startDate, int days,
                        String briefReason, String handoverPlan, String aiGeneratedLetter, Status status, String hrComments) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.startDate = startDate;
        this.days = days;
        this.briefReason = briefReason;
        this.handoverPlan = handoverPlan;
        this.aiGeneratedLetter = aiGeneratedLetter;
        this.status = status;
        this.hrComments = hrComments;
    }

    public LeaveRequest(String id, String employeeId, String employeeName, String startDate, int days,
                        String briefReason, String handoverPlan, String aiGeneratedLetter, Status status, String hrComments,
                        String employeeEmail, String employeePhone) {
        this(id, employeeId, employeeName, startDate, days, briefReason, handoverPlan, aiGeneratedLetter, status, hrComments);
        this.employeeEmail = employeeEmail;
        this.employeePhone = employeePhone;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }

    public String getBriefReason() { return briefReason; }
    public void setBriefReason(String briefReason) { this.briefReason = briefReason; }

    public String getHandoverPlan() { return handoverPlan; }
    public void setHandoverPlan(String handoverPlan) { this.handoverPlan = handoverPlan; }

    public String getAiGeneratedLetter() { return aiGeneratedLetter; }
    public void setAiGeneratedLetter(String aiGeneratedLetter) { this.aiGeneratedLetter = aiGeneratedLetter; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getHrComments() { return hrComments; }
    public void setHrComments(String hrComments) { this.hrComments = hrComments; }

    public String getEmployeeEmail() { return employeeEmail; }
    public void setEmployeeEmail(String employeeEmail) { this.employeeEmail = employeeEmail; }

    public String getEmployeePhone() { return employeePhone; }
    public void setEmployeePhone(String employeePhone) { this.employeePhone = employeePhone; }

    // Builder Pattern Implementation
    public static LeaveRequestBuilder builder() {
        return new LeaveRequestBuilder();
    }

    public static class LeaveRequestBuilder {
        private String id;
        private String employeeId;
        private String employeeName;
        private String startDate;
        private int days;
        private String briefReason;
        private String handoverPlan;
        private String aiGeneratedLetter;
        private Status status;
        private String hrComments;
        private String employeeEmail;
        private String employeePhone;

        public LeaveRequestBuilder id(String id) {
            this.id = id;
            return this;
        }

        public LeaveRequestBuilder employeeId(String employeeId) {
            this.employeeId = employeeId;
            return this;
        }

        public LeaveRequestBuilder employeeName(String employeeName) {
            this.employeeName = employeeName;
            return this;
        }

        public LeaveRequestBuilder startDate(String startDate) {
            this.startDate = startDate;
            return this;
        }

        public LeaveRequestBuilder days(int days) {
            this.days = days;
            return this;
        }

        public LeaveRequestBuilder briefReason(String briefReason) {
            this.briefReason = briefReason;
            return this;
        }

        public LeaveRequestBuilder handoverPlan(String handoverPlan) {
            this.handoverPlan = handoverPlan;
            return this;
        }

        public LeaveRequestBuilder aiGeneratedLetter(String aiGeneratedLetter) {
            this.aiGeneratedLetter = aiGeneratedLetter;
            return this;
        }

        public LeaveRequestBuilder status(Status status) {
            this.status = status;
            return this;
        }

        public LeaveRequestBuilder hrComments(String hrComments) {
            this.hrComments = hrComments;
            return this;
        }

        public LeaveRequestBuilder employeeEmail(String employeeEmail) {
            this.employeeEmail = employeeEmail;
            return this;
        }

        public LeaveRequestBuilder employeePhone(String employeePhone) {
            this.employeePhone = employeePhone;
            return this;
        }

        public LeaveRequest build() {
            return new LeaveRequest(id, employeeId, employeeName, startDate, days, briefReason, handoverPlan, aiGeneratedLetter, status, hrComments, employeeEmail, employeePhone);
        }
    }
}
