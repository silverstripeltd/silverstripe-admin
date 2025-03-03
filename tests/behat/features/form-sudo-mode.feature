@retry @job3
Feature: Form sudo mode
  As an site owner
  I want to have to re-enter my password to make changes to sensitive data
  So that my site is more secure

  Background:
    Given I add an extension "SilverStripe\FrameworkTest\SudoMode\MemberRelationsPageExtension" to the "Page" class
    And I go to "/dev/build?flush"
    And a "member" "My member"
    And a "group" "My group"
    And a "role" "My role"
    And a "page" "My page"
    # Explicitly test with an "ADMIN" user as that's the most important user to test has sudo mode active
    And I am logged in with "ADMIN" permissions

  Scenario: Sensitive data is protected by sudo mode

    # CMS profile
    When I go to "/admin/myprofile"
    Then I should see "Verify to continue"
    And I should see a "#Form_EditForm_action_save[readonly]" element

    # Security admin - members
    When I go to "/admin/security"
    Then I should see "Verify to continue"
    When I click on the ".ss-gridfield-item.first" element
    Then I should see "Verify to continue"
    And I should see a "#Form_ItemEditForm_action_doSave[readonly]" element

    # Security admin - groups
    When I go to "/admin/security/groups"
    Then I should see "Verify to continue"
    When I click on the ".ss-gridfield-item.first" element
    Then I should see "Verify to continue"
    And I should see a "#Form_ItemEditForm_action_doSave[readonly]" element
    
    # Security admin - group permissions
    When I click on the ".ui-tabs-tab[aria-controls=Root_Permissions]" element
    Then I should see a "#Permissions.checkboxsetfieldpermissioncheckboxsetfield_readonly" element

    # Security admin - roles
    When I go to "/admin/security/roles"
    Then I should see "Verify to continue"
    When I click on the ".ss-gridfield-item.first" element
    Then I should see "Verify to continue"
    And I should see a "#Form_ItemEditForm_action_doSave[readonly]" element

    # GridField relation - has_many
    When I go to "/admin/pages"
    And I click on "My page" in the tree
    And I click on the "#Form_EditForm_HasManyMembers .ss-gridfield-item.first" element
    And I should see a "#Form_ItemEditForm_action_doSave[readonly]" element

    # GridField relation - many_many
    When I go to "/admin/pages"
    And I click on "My page" in the tree
    And I click on the "#Form_EditForm_ManyManyMembers .ss-gridfield-item.first" element
    And I should see a "#Form_ItemEditForm_action_doSave[readonly]" element

  Scenario: Putting in a wrong password in to the sudo mode password field shows an error message

    When I go to "/admin/myprofile"
    And I click on the ".sudo-mode-password-field__notice-button" element
    And I fill in "SudoModePassword" with "incorrect-password"
    And I click on the ".sudo-mode-password-field__verify-button" element
    Then I should see "Incorrect password"
    And I should see a "#Form_EditForm_action_save[readonly]" element

  Scenario: Sensitive data can be edited after activating sudo mode

    # CMS profile - activate sudo mode
    When I go to "/admin/myprofile"
    And I click on the ".sudo-mode-password-field__notice-button" element
    And I fill in "SudoModePassword" with "Secret!123"
    And I click on the ".sudo-mode-password-field__verify-button" element
    And I wait for 2 seconds
    Then I should not see a "#Form_EditForm_action_save[readonly]" element

    # Security admin - members
    When I go to "/admin/security"
    Then I should not see "Verify to continue"
    When I click on the ".ss-gridfield-item.first" element
    Then I should not see "Verify to continue"
    And I should not see a "#Form_ItemEditForm_action_doSave[readonly]" element

    # Security admin - groups
    When I go to "/admin/security/groups"
    Then I should not see "Verify to continue"
    When I click on the ".ss-gridfield-item.first" element
    Then I should not see "Verify to continue"
    And I should not see a "#Form_ItemEditForm_action_doSave[readonly]" element

    # Security admin - group permissions
    When I click on the ".ui-tabs-tab[aria-controls=Root_Permissions]" element
    Then I should not see a "#Permissions.checkboxsetfieldpermissioncheckboxset" element

    # Security admin - roles
    When I go to "/admin/security/roles"
    Then I should not see "Verify to continue"
    When I click on the ".ss-gridfield-item.first" element
    Then I should not see "Verify to continue"
    And I should not see a "#Form_ItemEditForm_action_doSave[readonly]" element

    # GridField relation - has_many
    When I go to "/admin/pages"
    And I click on "My page" in the tree
    And I click on the "#Form_EditForm_HasManyMembers .ss-gridfield-item.first" element
    And I should not see a "#Form_ItemEditForm_action_doSave[readonly]" element

    # GridField relation - many_many
    When I go to "/admin/pages"
    And I click on "My page" in the tree
    And I click on the "#Form_EditForm_ManyManyMembers .ss-gridfield-item.first" element
    And I should not see a "#Form_ItemEditForm_action_doSave[readonly]" element
