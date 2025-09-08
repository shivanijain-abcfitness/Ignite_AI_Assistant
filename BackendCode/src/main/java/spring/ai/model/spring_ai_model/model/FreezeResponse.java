package spring.ai.model.spring_ai_model.model;

import java.util.List;

public class FreezeResponse {
    private String clubNumber;
    private String memberNumber;
    private String startDate;
    private List<AccountReview> accountReview;

    public String getClubNumber() {
        return clubNumber;
    }

    public void setClubNumber(String clubNumber) {
        this.clubNumber = clubNumber;
    }

    public String getMemberNumber() {
        return memberNumber;
    }

    public void setMemberNumber(String memberNumber) {
        this.memberNumber = memberNumber;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public List<AccountReview> getAccountReview() {
        return accountReview;
    }

    public void setAccountReview(List<AccountReview> accountReview) {
        this.accountReview = accountReview;
    }

    public static class AccountReview {
        private String date;
        private String description;
        private double amount;
        private double balanceDue;
        private int age;
        private String subscriptionId;
        private String createdDate;
        private String freezeId;

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public double getBalanceDue() {
            return balanceDue;
        }

        public void setBalanceDue(double balanceDue) {
            this.balanceDue = balanceDue;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getSubscriptionId() {
            return subscriptionId;
        }

        public void setSubscriptionId(String subscriptionId) {
            this.subscriptionId = subscriptionId;
        }

        public String getCreatedDate() {
            return createdDate;
        }

        public void setCreatedDate(String createdDate) {
            this.createdDate = createdDate;
        }

        public String getFreezeId() {
            return freezeId;
        }

        public void setFreezeId(String freezeId) {
            this.freezeId = freezeId;
        }
    }
}

