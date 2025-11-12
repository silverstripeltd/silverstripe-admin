<?php

namespace SilverStripe\Admin\Forms;

use SilverStripe\Admin\Forms\UnsavedChangesIndicator;
use SilverStripe\Core\Extension;
use SilverStripe\Forms\GridField\GridFieldDetailForm_ItemRequest;
use SilverStripe\Forms\FieldList;

/**
 * @extends Extension<GridFieldDetailForm_ItemRequest>
 */
class GridFieldDetailFormUnsavedChangesIndicatorExtension extends Extension
{
    protected function updateFormActions(FieldList $actions): void
    {
        $indcatorField = UnsavedChangesIndicator::create('UnsavedChangesIndicator');
        // Find a candidate to insertAfter()
        $candidates = [
            'action_doDelete',
            'MajorActions',
        ];
        foreach ($candidates as $candidate) {
            if ($actions->fieldByName($candidate)) {
                $actions->insertAfter($candidate, $indcatorField);
                return;
            }
        }
        // Fallback to appending
        $actions->push($indcatorField);
    }
}
