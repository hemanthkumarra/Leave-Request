package com.company.leaverequest.dto;

public class LeavePreviewRequest {
    private String employeeName;
    private String startDate;
    private int days;
    private String briefReason;
    private String handoverPlan;

    // Constructors
    public LeavePreviewRequest() {}

    public LeavePreviewRequest(String employeeName, String startDate, int days, String briefReason, String handoverPlan) {
        this.employeeName = employeeName;
        this.startDate = startDate;
        this.days = days;
        this.briefReason = briefReason;
        this.handoverPlan = handoverPlan;
    }

    // Getters and Setters
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
}
