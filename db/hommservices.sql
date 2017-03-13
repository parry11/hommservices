-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 03, 2017 at 02:02 PM
-- Server version: 5.7.14
-- PHP Version: 5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hommservices`
--

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `device_token` varchar(255) NOT NULL,
  `push_notification` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'On = 1, Off = 0',
  `created` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `vendor_category`
--

CREATE TABLE `vendor_category` (
  `vendor_category_id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL,
  `category_slug` varchar(255) NOT NULL,
  `category_icon` varchar(255) NOT NULL,
  `category_image_hdpi` varchar(255) NOT NULL,
  `category_image_mdpi` varchar(255) NOT NULL,
  `category_image_xhdpi` varchar(255) NOT NULL,
  `category_image_xxhdpi` varchar(255) NOT NULL,
  `category_image_xxxhdpi` varchar(255) NOT NULL,
  `created` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `vendor_category`
--

INSERT INTO `vendor_category` (`vendor_category_id`, `category_name`, `category_slug`, `category_icon`, `category_image_hdpi`, `category_image_mdpi`, `category_image_xhdpi`, `category_image_xxhdpi`, `category_image_xxxhdpi`, `created`) VALUES
(1, 'Venue', 'venue', '/images/vendor-cat/venue_icon.png', '/images/vendor-cat/mobile/drawable-hdpi/venue_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/venue_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/venue_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/venue_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/venue_pic.9.png', '2016-09-01 00:00:00'),
(2, 'Photographers', 'photographers', '/images/vendor-cat/photography_icon.png', '/images/vendor-cat/mobile/drawable-hdpi/photography_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/photography_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/photography_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/photography_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/photography_pic.9.png', '2016-09-01 00:00:00'),
(3, 'Bridal Wear', 'bridal-wear', '/images/vendor-cat/bridal_wear.png', '/images/vendor-cat/mobile/drawable-hdpi/bridal_wear_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/bridal_wear_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/bridal_wear_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/bridal_wear_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/bridal_wear_pic.9.png', '2016-09-01 00:00:00'),
(4, 'Makeup Artist', 'makeup-artist', '/images/vendor-cat/makeup_artist.png', '/images/vendor-cat/mobile/drawable-hdpi/makeup_artist_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/makeup_artist_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/makeup_artist_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/makeup_artist_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/makeup_artist_pic.9.png', '2016-09-01 00:00:00'),
(5, 'Groom Wear', 'groom-wear', '/images/vendor-cat/groom_wear.png', '/images/vendor-cat/mobile/drawable-hdpi/groom_wear_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/groom_wear_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/groom_wear_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/groom_wear_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/groom_wear_pic.9.png', '2016-09-01 00:00:00'),
(6, 'Decor', 'decor', '/images/vendor-cat/decorator.png', '/images/vendor-cat/mobile/drawable-hdpi/decorator_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/decorator_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/decorator_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/decorator_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/decorator_pic.9.png', '2016-09-01 00:00:00'),
(7, 'Wedding Planners', 'wedding-planners', '/images/vendor-cat/wedding_planner.png', '/images/vendor-cat/mobile/drawable-hdpi/wedding_plan_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/wedding_plan_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/wedding_plan_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/wedding_plan_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/wedding_plan_pic.9.png', '2016-09-01 00:00:00'),
(8, 'Invitations', 'invitations', '/images/vendor-cat/invitations.png', '/images/vendor-cat/mobile/drawable-hdpi/invitation_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/invitation_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/invitation_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/invitation_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/invitation_pic.9.png', '2016-09-01 00:00:00'),
(9, 'Cinema/Video', 'cinema-video', '/images/vendor-cat/cinema_video.png', '/images/vendor-cat/mobile/drawable-hdpi/video_cinema_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/video_cinema_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/video_cinema_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/video_cinema_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/video_cinema_pic.9.png', '2016-09-01 00:00:00'),
(10, 'Mehendi Artist', 'mehendi-artist', '/images/vendor-cat/mehandi_artist.png', '/images/vendor-cat/mobile/drawable-hdpi/mehandi_artist_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/mehandi_artist_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/mehandi_artist_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/mehandi_artist_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/mehandi_artist_pic.9.png', '2016-09-01 00:00:00'),
(11, 'Cake', 'cake', '/images/vendor-cat/cake.png', '/images/vendor-cat/mobile/drawable-hdpi/cake_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/cake_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/cake_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/cake_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/cake_pic.9.png', '2016-09-01 00:00:00'),
(12, 'Jewellery', 'jewellery', '/images/vendor-cat/jewellery.png', '/images/vendor-cat/mobile/drawable-hdpi/jewellery_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/jewellery_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/jewellery_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/jewellery_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/jewellery_pic.9.png', '2016-09-01 00:00:00'),
(13, 'Catering Services', 'catering-services', '/images/vendor-cat/catering_services.png', '/images/vendor-cat/mobile/drawable-hdpi/caterer_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/caterer_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/caterer_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/caterer_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/caterer_pic.9.png', '2016-09-01 00:00:00'),
(14, 'Trousseau Packers', 'trousseau-packers', '/images/vendor-cat/trousseu_packers.png', '/images/vendor-cat/mobile/drawable-hdpi/venue_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/venue_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/venue_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/venue_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/venue_pic.9.png', '2016-09-01 00:00:00'),
(15, 'DJS', 'djs', '/images/vendor-cat/dj.png', '/images/vendor-cat/mobile/drawable-hdpi/trousseu_packers_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/trousseu_packers_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/trousseu_packers_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/trousseu_packers_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/trousseu_packers_pic.9.png', '2016-09-01 00:00:00'),
(16, 'Choreographer', 'choreographer', '/images/vendor-cat/choreographers.png', '/images/vendor-cat/mobile/drawable-hdpi/choreographer.9.png', '/images/vendor-cat/mobile/drawable-mdpi/choreographer.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/choreographer.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/choreographer.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/choreographer.9.png', '2016-09-01 00:00:00'),
(17, 'Accessories', 'accessories', '/images/vendor-cat/accessories.png', '/images/vendor-cat/mobile/drawable-hdpi/accessories_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/accessories_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/accessories_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/accessories_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/accessories_pic.9.png', '2016-09-01 00:00:00'),
(18, 'Favors', 'favors', '/images/vendor-cat/favors.png', '/images/vendor-cat/mobile/drawable-hdpi/favor_pic.9.png', '/images/vendor-cat/mobile/drawable-mdpi/favor_pic.9.png', '/images/vendor-cat/mobile/drawable-xhdpi/favor_pic.9.png', '/images/vendor-cat/mobile/drawable-xxhdpi/favor_pic.9.png', '/images/vendor-cat/mobile/drawable-xxxhdpi/favor_pic.9.png', '2016-09-01 00:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendor_category`
--
ALTER TABLE `vendor_category`
  ADD PRIMARY KEY (`vendor_category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `vendor_category`
--
ALTER TABLE `vendor_category`
  MODIFY `vendor_category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
