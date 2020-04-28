<?php

declare(strict_types=1);

namespace Leoloso\GraphQLByPoPWPPlugin\Blocks;

use Leoloso\GraphQLByPoPWPPlugin\Blocks\AbstractControlBlock;
use Leoloso\GraphQLByPoPWPPlugin\Blocks\GraphQLByPoPBlockTrait;

/**
 * Cache Control block
 */
class CacheControlBlock extends AbstractControlBlock
{
    public const ATTRIBUTE_NAME_CACHE_CONTROL_MAX_AGE = 'cacheControlMaxAge';

    use GraphQLByPoPBlockTrait;

    protected function getBlockName(): string
    {
        return 'cache-control';
    }

    protected function registerCommonStyleCSS(): bool
    {
        return true;
    }

    protected function getBlockDataTitle(): string
    {
        return \__('Set cache-control header for:', 'graphql-api');
    }
    protected function getBlockContentTitle(): string
    {
        return \__('Max-age:', 'graphql-api');
    }
    protected function getBlockContent(array $attributes, string $content): string
    {
        $blockContentPlaceholder = <<<EOF
        <div class="%s">
            %s
        </div>
EOF;
        $cacheControlMaxAge = $attributes[self::ATTRIBUTE_NAME_CACHE_CONTROL_MAX_AGE];
        if (is_null($cacheControlMaxAge) || $cacheControlMaxAge < 0) {
            $cacheControlMaxAgeText = sprintf(
                '<em>%s</em>',
                \__('(not set)', 'graphql-api')
            );
        } elseif ($cacheControlMaxAge === 0) {
            $cacheControlMaxAgeText = sprintf(
                \__('%s seconds (<code>no-store</code>)', 'graphql-api'),
                $cacheControlMaxAge
            );
        } else {
            $cacheControlMaxAgeText = sprintf(
                \__('%s seconds', 'graphql-api'),
                $cacheControlMaxAge
            );
        }
        return sprintf(
            $blockContentPlaceholder,
            $this->getBlockClassName() . '__content',
            $cacheControlMaxAgeText
        );
    }
}
