<?php

    $sizes = ['Tiny', 'Mini', 'Bitesize', 'Small', 'Medium', 'Huge', 'Not So Small', 'Large', 'Kingsize'];
    $animals = ['Tiger', 'Zebra', 'Lion', 'Hippo', 'Seal', 'Dolphin', 'Shark', 'Whale', 'Cat', 'Dog', 'Wolf'];
    $colors = ['Blue', 'Pink', 'Rainbow', 'Orange', 'Black', 'White', 'Yellow', 'Green', 'Polkadot'];

    $size = $sizes[mt_rand(0, count($sizes) - 1)];
    $animal = $animals[mt_rand(0, count($animals) - 1)];
    $color = $colors[mt_rand(0, count($colors) - 1)];

    echo $size . ' ' . $color . ' ' . $animal;