<?php

namespace SilverStripe\Admin;

use SilverStripe\Admin\Forms\EditorEmailLinkFormFactory;
use SilverStripe\Admin\Forms\EditorExternalLinkFormFactory;
use SilverStripe\Admin\Forms\EditorNumberLinkFormFactory;
use SilverStripe\Control\Controller;
use SilverStripe\Control\RequestHandler;
use SilverStripe\Forms\Form;

/**
 * Parent controller for all CMS-global modals
 */
class ModalController extends RequestHandler
{
    private static $allowed_actions = [
        'EditorExternalLink',
        'EditorEmailLink',
        'EditorNumberLink',
    ];

    public function Link($action = null)
    {
        return Controller::join_links(
            $this->getController()->Link(),
            $this->getName(),
            $action,
            '/'
        );
    }

    /**
     * @var Controller
     */
    protected $controller;

    /**
     * @var string
     */
    protected $name;

    public function __construct($controller, $name)
    {
        parent::__construct();

        $this->controller = $controller;
        $this->name = $name;
    }

    public function getRequest()
    {
        return $this->controller->getRequest();
    }

    /**
     * @return Controller
     */
    public function getController()
    {
        return $this->controller;
    }

    /**
     * Get urlsegment
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Builds and returns the external link form
     *
     * @return Form
     */
    public function EditorExternalLink()
    {
        // Show link text field if requested
        $showLinkText = $this->controller->getRequest()->getVar('requireLinkText');
        $factory = EditorExternalLinkFormFactory::singleton();
        return $factory->getForm(
            $this->controller,
            "{$this->name}/EditorExternalLink",
            [ 'RequireLinkText' => isset($showLinkText) ]
        );
    }

    /**
     * Builds and returns the email link form
     *
     * @return Form
     */
    public function EditorEmailLink()
    {
        // Show link text field if requested
        $showLinkText = $this->controller->getRequest()->getVar('requireLinkText');
        $factory = EditorEmailLinkFormFactory::singleton();
        return $factory->getForm(
            $this->controller,
            "{$this->name}/EditorEmailLink",
            [ 'RequireLinkText' => isset($showLinkText) ]
        );
    }

    /**
     * Builds and returns the number link form
     *
     * @return Form
     */
    public function EditorNumberLink()
    {
        // Show link text field if requested
        $showLinkText = $this->controller->getRequest()->getVar('requireLinkText');
        $factory = EditorNumberLinkFormFactory::singleton();
        return $factory->getForm(
            $this->controller,
            "{$this->name}/EditorNumberLink",
            [ 'RequireLinkText' => isset($showLinkText) ]
        );
    }
}
