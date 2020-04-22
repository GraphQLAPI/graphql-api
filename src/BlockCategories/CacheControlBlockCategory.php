<?php

declare(strict_types=1);

namespace Leoloso\GraphQLByPoPWPPlugin\BlockCategories;

use Leoloso\GraphQLByPoPWPPlugin\PostTypes\GraphQLCacheControlListPostType;

class CacheControlBlockCategory extends AbstractBlockCategory
{
    public const CACHE_CONTROL_BLOCK_CATEGORY = 'graphql-api-cache-control';

    /**
     * Custom Post Type for which to enable the block category
     *
     * @return string
     */
    protected function getPostType(): string
    {
        return GraphQLCacheControlListPostType::POST_TYPE;
    }

    /**
     * Block category's slug
     *
     * @return string
     */
    protected function getBlockCategorySlug(): string
    {
        return self::CACHE_CONTROL_BLOCK_CATEGORY;
    }

    /**
     * Block category's title
     *
     * @return string
     */
    protected function getBlockCategoryTitle(): string
    {
        return __('Cache Control for GraphQL', 'graphql-api');
    }
}
