<?php

namespace SilverStripe\Admin\Tests;

use SilverStripe\Dev\SapphireTest;
use PHPUnit\Framework\Attributes\DataProvider;
use SilverStripe\View\SSViewer;
use SilverStripe\Admin\LeftAndMain;
use SilverStripe\Forms\FormField;

class AriaAttributesTest extends SapphireTest
{
    public static function provideAriaAttributesInclude(): array
    {
        return [
            'all' => [
                'message' => 'MyMessage',
                'description' => 'MyDescription',
                'title' => 'MyTitle',
                'rightTitle' => 'MyRightTitle',
            ],
            'message only' => [
                'message' => 'MyMessage',
                'description' => '',
                'title' => '',
                'rightTitle' => '',
            ],
            'description only' => [
                'message' => '',
                'description' => 'MyDescription',
                'title' => '',
                'rightTitle' => '',
            ],
            'title only' => [
                'message' => '',
                'description' => '',
                'title' => 'MyTitle',
                'rightTitle' => '',
            ],
            'righttitle only' => [
                'message' => '',
                'description' => '',
                'title' => '',
                'rightTitle' => 'MyRightTitle',
            ],
            'message and title' => [
                'message' => 'MyMessage',
                'description' => '',
                'title' => 'MyTitle',
                'rightTitle' => '',
            ],
            'description and righttitle' => [
                'message' => '',
                'description' => 'MyDescription',
                'title' => '',
                'rightTitle' => 'MyRightTitle',
            ],
        ];
    }

    /**
     * Tests the admin/themes/cms-forms/templates/Forms/Includes/AriaAttributes.ss template logic
     */
    #[DataProvider('provideAriaAttributesInclude')]
    public function testAriaAttributesInclude(
        string $message,
        string $description,
        string $title,
        string $rightTitle
    ): void {
        SSViewer::set_themes(LeftAndMain::config()->uninherited('admin_themes'));
        $field = new FormField('MyName');
        $field->setMessage($message);
        $field->setDescription($description);
        $field->setTitle($title);
        $field->setRightTitle($rightTitle);
        $ariaDescribedBy = '';
        if ($message && $description) {
            $ariaDescribedBy = 'aria-describedby="message-MyName describes-MyName"';
        } elseif ($message) {
            $ariaDescribedBy = 'aria-describedby="message-MyName"';
        } elseif ($description) {
            $ariaDescribedBy = 'aria-describedby="describes-MyName"';
        }
        $ariaLabelledBy = '';
        if ($title && $rightTitle) {
            $ariaLabelledBy = 'aria-labelledby="title-MyName extra-label-MyName"';
        } elseif ($title) {
            $ariaLabelledBy = 'aria-labelledby="title-MyName"';
        } elseif ($rightTitle) {
            $ariaLabelledBy = 'aria-labelledby="extra-label-MyName"';
        }
        $classes = ['form-control', 'form'];
        if (!$title) {
            $classes[] = 'form-group--no-label';
        }
        if ($message) {
            $classes[] = 'holder-error';
        }
        $class = implode(' ', $classes);
        $expected = implode(' ', [
            '<input type="text" name="MyName" id="MyName" class="' . $class . '"',
            $ariaDescribedBy,
            $ariaLabelledBy,
            '/>'
        ]);
        $this->assertXmlStringEqualsXmlString(
            $this->toXml($expected),
            $this->toXml((string) $field->Field())
        );
    }

    /**
     * Ensure there is a single parent node in preparation for using assertXmlStringEqualsXmlString()
     * which is tolerant of whitespaces differences
     * This prevents the error PHPUnit\Util\Xml\XmlException: Extra content at the end of the document
     */
    private function toXml(string $html)
    {
        return "<div>$html</div>";
    }
}
