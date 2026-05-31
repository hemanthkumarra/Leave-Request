package com.company.leaverequest.dto;

public class StatusUpdateRequest {
    private String status;
    private String hrComments;

    // Constructors
    public StatusUpdateRequest() {}

    public StatusUpdateRequest(String status, String hrComments) {
        this.status = status;
        this.hrComments = hrComments;
    }

    // Getters and Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getHrComments() { return hrComments; }
    public void setHrComments(String hrComments) { this.hrComments = hrComments; }
}
