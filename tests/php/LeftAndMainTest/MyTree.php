<?php

namespace SilverStripe\Admin\Tests\LeftAndMainTest;

use SilverStripe\ORM\DataObject;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Core\Validation\ValidationResult;

class MyTree extends DataObject implements TestOnly
{
    public const INVALID_CONTENT = 'INVALID_CONTENT';

    public const INVALID_CONTENT_MESSAGE = 'INVALID_CONTENT_MESSAGE';

    private static $db = [
        'Content' => 'Varchar'
    ];

    public function validate(): ValidationResult
    {
        $validationResult = parent::validate();
        if ($this->Content === static::INVALID_CONTENT) {
            $validationResult->addFieldError('Content', static::INVALID_CONTENT_MESSAGE);
        }
        return $validationResult;
    }
}
