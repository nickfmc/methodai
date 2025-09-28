<?php
/**
 * Stat Counter Block Template
 * 
 * @param array $block The block settings and attributes.
 * @param string $content The block inner HTML (empty).
 * @param bool $is_preview True during backend preview render.
 * @param int $post_id The post ID the block is rendering content against.
 */

// Create id attribute allowing for custom "anchor" value.
$id = 'stat-counter-' . $block['id'];
if (!empty($block['anchor'])) {
    $id = $block['anchor'];
}

// Create class attribute allowing for custom "className" and "align" values.
$classes = 'c-stat-counter';
if (!empty($block['className'])) {
    $classes .= ' ' . $block['className'];
}
if (!empty($block['align'])) {
    $classes .= ' align' . $block['align'];
}

// Get ACF fields
$stat_number = get_field('stat_number');
$stat_label = get_field('stat_label');
$animation_duration = get_field('animation_duration') ?: 2000; // Default 2 seconds
$animation_delay = get_field('animation_delay') ?: 0; // Default no delay
?>

<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr($classes); ?>" 
     data-duration="<?php echo esc_attr($animation_duration); ?>"
     data-delay="<?php echo esc_attr($animation_delay); ?>">
    
    <?php if ($stat_number): ?>
        <div class="c-stat-counter__number" data-target="<?php echo esc_attr($stat_number); ?>">
            <?php echo esc_html($stat_number); ?>
        </div>
    <?php endif; ?>
    
    <?php if ($stat_label): ?>
        <div class="c-stat-counter__label">
            <?php echo esc_html($stat_label); ?>
        </div>
    <?php endif; ?>
    
</div>