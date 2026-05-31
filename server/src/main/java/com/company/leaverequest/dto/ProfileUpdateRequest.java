package com.company.leaverequest.dto;

public class ProfileUpdateRequest {
    private String username;
    private String email;
    private String phoneNumber;
    private String newPassword;

    // Constructors
    public ProfileUpdateRequest() {}

    public ProfileUpdateRequest(String username, String email, String phoneNumber, String newPassword) {
        this.username = username;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.newPassword = newPassword;
    }

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
