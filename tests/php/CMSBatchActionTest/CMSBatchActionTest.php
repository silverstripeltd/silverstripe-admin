<?php

namespace SilverStripe\Admin\Tests\CMSBatchActionTest;

use SilverStripe\Dev\SapphireTest;
use SilverStripe\ORM\DataList;
use SilverStripe\Security\Group;
use SilverStripe\Control\HTTPResponse;

class CMSBatchActionTest extends SapphireTest
{
    public function testRunBatchAction()
    {
        $action = new TestCMSBatchAction();
        $response = $action->run(new DataList(Group::class));
        $this->assertTrue(is_a($response, HTTPResponse::class));
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals('application/json', $response->getHeader('Content-Type'));
        $this->assertSame('{"success":[1]}', $response->getBody());
    }
}
