<?php
namespace Leoloso\GraphQLByPoPWPPlugin\Blocks;

/**
 * Access Control Disable Access block
 */
class AccessControlDisableAccessBlock extends AbstractAccessControlNestedBlock
{
    protected function getBlockName(): string
    {
        return 'access-control-disable-access';
    }

    protected function isDynamicBlock(): bool
    {
        return true;
    }

    public function renderBlock($attributes, $content): string
	{
		return sprintf(
            '<ul class="%s"><li>%s</li></ul>',
            $this->getBlockClassName(),
            __('Nobody', 'graphql-api')
        );
	}
}