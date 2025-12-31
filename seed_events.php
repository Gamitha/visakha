<?php
use App\Models\Event;
use Carbon\Carbon;

// Clear existing events to prevent duplicates/stale data during verification
Event::truncate();

// Today's Event
Event::create([
    'title' => 'Annual Prize Giving 2025',
    'description' => "The most prestigious event of the year honoring academic excellence.\n\nAgenda:\n8:00 AM - Arrival of Chief Guest\n8:30 AM - Lighting of the Oil Lamp\n9:00 AM - Award Distribution",
    'event_date' => Carbon::today(),
    'event_time' => '09:00:00',
    'venue' => 'Jeremias Dias Hall',
    'images' => ['https://visakhavidyalaya.lk/storage/Header%20Images/1.jpg', 'https://visakhavidyalaya.lk/storage/Header%20Images/2.jpg']
]);

// Future Events
Event::create([
    'title' => 'Inter-House Sports Meet',
    'description' => 'Showcasing the athletic talents of Visakhians.',
    'event_date' => Carbon::today()->addDays(5),
    'event_time' => '13:00:00',
    'venue' => 'School Grounds'
]);
Event::create([
    'title' => 'Vesak Bhakti Gee',
    'description' => 'A spiritual evening of songs.',
    'event_date' => Carbon::today()->addDays(20),
    'event_time' => '18:00:00',
    'venue' => 'Main Hall'
]);

// Past Events
Event::create([
    'title' => 'New Year Celebrations',
    'description' => 'Traditional Avurudu games.',
    'event_date' => Carbon::today()->subDays(10),
    'venue' => 'Primary Section'
]);
Event::create([
    'title' => 'Art Exhibition',
    'description' => 'Creative works by students.',
    'event_date' => Carbon::today()->subDays(25),
    'venue' => 'Art Gallery'
]);

echo "Events re-seeded successfully.\n";
