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

  Scenario: Site tree keyboard navigation
    Given a "Page" "Page 1"
    And a "Page" "Page 2"
    And the "Page" "Page 2a" is a child of a "Page" "Page 2"
    And the "Page" "Page 2b" is a child of a "Page" "Page 2"
    And the "Page" "Page 2bi" is a child of a "Page" "Page 2b"
    And the "Page" "Page 2bii" is a child of a "Page" "Page 2b"
    And the "Page" "Page 2biii" is a child of a "Page" "Page 2b"
    And the "Page" "Page 2c" is a child of a "Page" "Page 2"
    And a "Page" "Page 3"
    And I am logged in with "ADMIN" permissions
    And I go to "/admin/pages"

    # Move focus to the element before the site tree so we have a known starting point
    When I focus on the "a[data-view='listview']" element
    And I press the "Tab" key globally
    Then the ".jstree-no-checkboxes > .nodelete > .jstree-icon" element should have focus
    When I press the "Tab" key globally
    Then the "a[title='(Record type: Page) Page 1']" element should have focus

    # Pages and toggle icon each receive tab focus
    When I press the "Tab" key globally
    Then the ".jstree-closed .jstree-icon" element should have focus
    When I press the "Tab" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus
    When I press the "Tab" key globally
    Then the "a[title='(Record type: Page) Page 3']" element should have focus

    # Up moves to previous sibling and skips toggle
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 1']" element should have focus

    # Down moves to next sibling
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus

    # Right arrow opens node if closed, focus stays on parent
    When I press the "Right" key globally
    Then I should see "Page 2a"
    And the "a[title='(Record type: Page) Page 2']" element should have focus

    # Left arrow closes node if open
    When I press the "Left" key globally
    Then I should not see "Page 2a"
    And the "a[title='(Record type: Page) Page 2']" element should have focus

    # Both Enter and Space on icon toggles node open/closed tab to icon
    When I press the "Shift-Tab" key globally
    Then the ".jstree-closed .jstree-icon" element should have focus
    When I press the "Enter" key globally
    Then I should see "Page 2a"
    When I press the "Enter" key globally
    Then I should not see "Page 2a"
    When I press the "Space" key globally
    Then I should see "Page 2a"

    # PageUp/PageDown moves to first/last sibling
    When I press the "Tab" key globally
    When I press the "Tab" key globally
    And the "a[title='(Record type: Page) Page 2a']" element should have focus
    When I press the "Page_Down" key globally
    Then the "a[title='(Record type: Page) Page 2c']" element should have focus
    When I press the "Page_Up" key globally
    Then the "a[title='(Record type: Page) Page 2a']" element should have focus

    # Can open nested children
    When I press the "Down" key globally
    And the "a[title='(Record type: Page) Page 2b']" element should have focus
    When I press the "Right" key globally
    Then I should see "Page 2bi"

    # Up + Down moves through all visible nodes
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 2a']" element should have focus
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus
    When I press the "Up" key globally
    Then the "a[title='(Record type: Page) Page 1']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2a']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2b']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2bi']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2bii']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2biii']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 2c']" element should have focus
    When I press the "Down" key globally
    Then the "a[title='(Record type: Page) Page 3']" element should have focus
