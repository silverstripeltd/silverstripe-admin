@retry @job2
Feature: Accessibility
  As a keyboard user
  I want to be able to easily navigate the CMS with my keyboard

  Scenario: Skip link functions
    Given I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"
    Then I should not see "Skip main navigation"

    # Skip link should be first thing tabbed to
    When I press the "Tab" key globally
    Then I should see "Skip main navigation"
    And the ".cms-container-skip-link" element should have focus

    # If we tab past the skip link, we should be on the first "normal link"
    When I press the "Tab" key globally
    Then I should not see "Skip main navigation"
    And the ".cms-sitename__title" element should have focus

    # Can shift-tab back to the skip link
    When I press the "Shift-Tab" key globally
    Then I should see "Skip main navigation"
    And the ".cms-container-skip-link" element should have focus

    # Using the skip link goes to the skip link target
    When I press the "Enter" key globally
    Then I should not see "Skip main navigation"
    And the ".cms-container-skip-link-target" element should have focus
    # Pressing tab twice and not testing that we are focused on .font-icon-search because
    # for whatever reason CI has different coords to the document.activeElement vs the one it's
    # selecting with the queryselector
    When I press the "Tab" key globally
    When I press the "Tab" key globally
    And the ".cms-content-addpage-button" element should have focus

  Scenario: Skip link works on non-page section
    Given I am logged in with "ADMIN" permissions
    And I go to "/admin/security"
    Then I should not see "Skip main navigation"
    When I press the "Tab" key globally
    Then I should see "Skip main navigation"
    And the ".cms-container-skip-link" element should have focus
    When I press the "Enter" key globally
    Then I should not see "Skip main navigation"
    And the ".cms-container-skip-link-target" element should have focus
    When I press the "Tab" key globally
    And the ".tab-users" element should have focus

  Scenario: Skip link works after ajax navigation to member profile
    Given I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"
    When I press the "Tab" key globally
    And I press the "Tab" key globally
    And I press the "Tab" key globally
    And the ".cms-login-status__profile-link" element should have focus
    When I press the "Enter" key globally
    Then I should not see "Skip main navigation"
    When I press the "Shift-Tab" key globally
    When I press the "Shift-Tab" key globally
    Then I should see "Skip main navigation"
    And the ".cms-container-skip-link" element should have focus
    When I press the "Enter" key globally
    Then I should not see "Skip main navigation"
    And the ".cms-container-skip-link-target" element should have focus
    When I press the "Tab" key globally
    And the ".ui-tabs-tab[aria-controls='Root_Main']" element should have focus
