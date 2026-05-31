package com.company.leaverequest.dto;

public class LeaveSubmitRequest {
    private String startDate;
    private int days;
    private String briefReason;
    private String handoverPlan;
    private String aiGeneratedLetter;

    // Constructors
    public LeaveSubmitRequest() {}

    public LeaveSubmitRequest(String startDate, int days, String briefReason, String handoverPlan, String aiGeneratedLetter) {
        this.startDate = startDate;
        this.days = days;
        this.briefReason = briefReason;
        this.handoverPlan = handoverPlan;
        this.aiGeneratedLetter = aiGeneratedLetter;
    }

    // Getters and Setters
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
}
