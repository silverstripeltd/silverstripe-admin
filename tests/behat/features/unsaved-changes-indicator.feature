@javascript @retry @job2
Feature: Unsaved changes indicator
  As an author
  I want to be alerted of unsaved changes

  Background:
    # Config will put ~2 second delay until the unsaved changes notice shows
    Given I have a config file "unsaved-changes-indicator-admin.yml"
    And I am logged in with "ADMIN" permissions

  Scenario: I see an unsaved changes indicator on page edit form
    Given a "page" "My page"
    When I go to "/admin/pages"
    And I click on "My page" in the tree
    Then I should not see the ".unsaved-changes-indicator" element
    When I fill in "Form_EditForm_Title" with "Hello"
    Then I should not see the ".unsaved-changes-indicator" element
    When I wait for 3 seconds
    Then I should see the ".unsaved-changes-indicator" element
    When I fill in "Form_EditForm_Title" with "My page"
    Then I should not see the ".unsaved-changes-indicator" element

  Scenario: I see an unsaved changes indicator on gridfield edit form
    Given the "Company" "Company A" with "Category"="Other"
    When I go to "/admin/test"
    Then I click "Company A" in the "#Form_EditForm" element
    Then I should not see the ".unsaved-changes-indicator" element
    And I fill in "Name" with "Hello"
    Then I should not see the ".unsaved-changes-indicator" element
    When I wait for 3 seconds
    Then I should see the ".unsaved-changes-indicator" element
    When I fill in "Name" with "Company A"
    Then I should not see the ".unsaved-changes-indicator" element

  Scenario: I see an unsaved changes indicator on single record admin
    When I go to "/admin/settings"
    Then I should not see the ".unsaved-changes-indicator" element
    And I fill in "Site title" with "Hello"
    Then I should not see the ".unsaved-changes-indicator" element
    When I wait for 3 seconds
    Then I should see the ".unsaved-changes-indicator" element
    When I fill in "Site title" with "Your Site Name"
    Then I should not see the ".unsaved-changes-indicator" element
