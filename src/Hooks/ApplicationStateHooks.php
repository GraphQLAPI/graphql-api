<?php

declare(strict_types=1);

namespace GraphQLAPI\GraphQLAPI\Hooks;

use PoP\Engine\Hooks\AbstractHookSet;
use PoP\ComponentModel\ModelInstance\ModelInstance;

class ApplicationStateHooks extends AbstractHookSet
{
    protected function init()
    {
        // ----------------------------------------
        // Commented, since `is_admin` is added to
        // `CacheConfigurationManager.getNamespace()`
        // ----------------------------------------
        // $this->hooksAPI->addFilter(
        //     ModelInstance::HOOK_COMPONENTSFROMVARS_RESULT,
        //     [$this, 'addComponent']
        // );
        // ----------------------------------------
    }
    /**
     * Admin and non-admin have different schemas
     */
    public function addComponent(array $components): array
    {
        $components[] = $this->translationAPI->__('is admin:', 'graphql-api') . \is_admin();
        return $components;
    }
}
