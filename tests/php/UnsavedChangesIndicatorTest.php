<?php

namespace SilverStripe\Admin\Tests;

use RuntimeException;
use SilverStripe\Admin\Forms\UnsavedChangesIndicator;
use SilverStripe\Dev\SapphireTest;
use PHPUnit\Framework\Attributes\DataProvider;

class UnsavedChangesIndicatorTest extends SapphireTest
{
    public function testGetSchemaDataDefaults(): void
    {
        $indicator = new UnsavedChangesIndicator('test', 'Test');
        $data = $indicator->getSchemaDataDefaults();
        $this->assertEquals(5, $data['minutes']['notice']);
        $this->assertEquals(10, $data['minutes']['warning']);
    }

    public function testGetAttributes(): void
    {
        $indicator = new UnsavedChangesIndicator('test', 'Test');
        $attributes = $indicator->getAttributes();
        $decoded = json_decode($attributes['data-minutes'], true);
        $this->assertEquals(5, $decoded['notice']);
        $this->assertEquals(10, $decoded['warning']);
    }

    public static function provideValidateConfig(): array
    {
        return [
            'valid' => [
                [
                    'notice' => 5,
                    'warning' => 10,
                ],
                'expectException' => false,
            ],
            'no notice' => [
                [
                    'notice' => 0,
                    'warning' => 10,
                ],
                'expectException' => false,
            ],
            'no warning' => [
                [
                    'notice' => 10,
                    'warning' => 0,
                ],
                'expectException' => false,
            ],
            'nothing' => [
                [
                    'notice' => 0,
                    'warning' => 0,
                ],
                'expectException' => false,
            ],
            'equal' => [
                [
                    'notice' => 10,
                    'warning' => 10,
                ],
                'expectException' => false,
            ],
            'warning less than notice' => [
                [
                    'notice' => 10,
                    'warning' => 5,
                ],
                'expectException' => true,
            ],
            'decimal' => [
                [
                    'notice' => 1,
                    'warning' => 2.5,
                ],
                'expectException' => false,
            ],
            'negative' => [
                [
                    'notice' => -1,
                    'warning' => 10,
                ],
                'expectException' => true,
            ],
            'missing notice' => [
                [
                    'warning' => 10,
                ],
                'expectException' => true,
            ],
            'bool' => [
                [
                    'notice' => 5,
                    'warning' => false,
                ],
                'expectException' => true,
            ],
            'null' => [
                [
                    'notice' => 5,
                    'warning' => null,
                ],
                'expectException' => true,
            ],
            'string' => [
                [
                    'notice' => 5,
                    'warning' => 'ten',
                ],
                'expectException' => true,
            ],
            'missing warning' => [
                [
                    'notice' => 5,
                ],
                'expectException' => true,
            ],
        ];
    }

    #[DataProvider('provideValidateConfig')]
    public function testValidateConfig(array $config, bool $expectException): void
    {
        if ($expectException) {
            $this->expectException(RuntimeException::class);
        } else {
            $this->expectNotToPerformAssertions();
        }
        UnsavedChangesIndicator::config()->set('minutes', $config);
        $indicator = new UnsavedChangesIndicator('test', 'Test');
        $indicator->getSchemaDataDefaults();
    }
}
