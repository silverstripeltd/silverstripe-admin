<?php

namespace SilverStripe\Admin\Tests\CMSBatchActionTest;

use SilverStripe\Admin\CMSBatchAction;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Dev\TestOnly;
use SilverStripe\Model\List\SS_List;

class TestCMSBatchAction extends CMSBatchAction implements TestOnly
{
    public function getActionTitle()
    {
        return 'TestCMSBatchAction';
    }

    public function run(SS_List $objs): HTTPResponse
    {
        return $this->response('Yay', ['success' => [1]]);
    }
}
