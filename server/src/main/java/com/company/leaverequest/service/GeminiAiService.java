package com.company.leaverequest.service;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GeminiAiService {

    @Autowired(required = false)
    private ChatModel chatModel;

    public String generateLeaveLetter(String employeeName, String startDate, int days, String briefReason, String handoverPlan) {
        String prompt = String.format(
            "Write a formal corporate leave request letter with the following details:\n" +
            "- Employee Name: %s\n" +
            "- Start Date: %s\n" +
            "- Leave Duration: %d days\n" +
            "- Reason for Leave: %s\n" +
            "- Handover Plan: %s\n\n" +
            "Please ensure the letter is highly professional, polite, well-structured, and suitable for HR submission. " +
            "Do not include any placeholders; write full, complete paragraphs. Return ONLY the letter body text without any extra chat, markdown annotations, or introductory pleasantries.",
            employeeName, startDate, days, briefReason, handoverPlan
        );

        if (chatModel == null) {
            return getDefaultLetter(employeeName, startDate, days, briefReason, handoverPlan);
        }

        try {
            String aiResponse = chatModel.call(prompt);
            if (aiResponse == null || aiResponse.trim().isEmpty()) {
                return getDefaultLetter(employeeName, startDate, days, briefReason, handoverPlan);
            }
            return aiResponse.trim();
        } catch (Exception e) {
            // Fallback in case of API limit, incorrect API key, or networking issues
            return getDefaultLetter(employeeName, startDate, days, briefReason, handoverPlan);
        }
    }

    private String getDefaultLetter(String employeeName, String startDate, int days, String briefReason, String handoverPlan) {
        return String.format(
            "Dear HR Department,\n\n" +
            "I am writing to formally request a leave of absence from my role, starting on %s for a period of %d days. " +
            "The purpose of this leave is %s.\n\n" +
            "To ensure that my absence does not cause any disruption to our team's workflow, I have prepared the following handover plan: %s. " +
            "I will ensure all pending tasks are fully documented and shared prior to my departure date.\n\n" +
            "Thank you very much for your time and understanding in reviewing my request. Please let me know if any further clarification or documentation is required.\n\n" +
            "Sincerely,\n%s",
            startDate, days, briefReason, handoverPlan, employeeName
        );
    }
}
