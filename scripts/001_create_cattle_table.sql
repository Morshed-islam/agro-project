-- Create cattle table for storing cattle information
CREATE TABLE IF NOT EXISTS cattle (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  weight DECIMAL(10, 2) NOT NULL,
  age INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  location TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample cattle data
INSERT INTO cattle (name, breed, weight, age, price, description, images, video_url, location, status) VALUES
('রাজা', 'ব্রাহমা', 450.00, 3, 180000.00, 'সুস্বাস্থ্যের অধিকারী একটি প্রিমিয়াম ব্রাহমা জাতের গরু। কুরবানির জন্য আদর্শ।', ARRAY['/placeholder.svg?height=400&width=600'], 'https://example.com/video1.mp4', 'ঢাকা', 'available'),
('সুলতান', 'সিন্ধি', 380.00, 2, 150000.00, 'চমৎকার শারীরিক গঠনের সিন্ধি জাতের গরু। খুবই সুস্থ এবং সবল।', ARRAY['/placeholder.svg?height=400&width=600'], 'https://example.com/video2.mp4', 'চট্টগ্রাম', 'available'),
('বাদশা', 'শাহীওয়াল', 420.00, 4, 165000.00, 'বড় আকারের শাহীওয়াল জাতের গরু। কুরবানির জন্য উপযুক্ত।', ARRAY['/placeholder.svg?height=400&width=600'], 'https://example.com/video3.mp4', 'সিলেট', 'available'),
('জহির', 'দেশি', 320.00, 2, 120000.00, 'স্থানীয় দেশি জাতের সুস্থ গরু। ভালো মাংসের জন্য পরিচিত।', ARRAY['/placeholder.svg?height=400&width=600'], NULL, 'রাজশাহী', 'available'),
('আলম', 'ব্রাহমা', 480.00, 3, 195000.00, 'অত্যন্ত সুস্বাস্থ্যের অধিকারী প্রিমিয়াম ব্রাহমা গরু।', ARRAY['/placeholder.svg?height=400&width=600'], 'https://example.com/video4.mp4', 'খুলনা', 'available'),
('মজিদ', 'সিন্ধি', 360.00, 2, 140000.00, 'মাঝারি আকারের সিন্ধি জাতের গরু। খুবই সুস্থ।', ARRAY['/placeholder.svg?height=400&width=600'], NULL, 'বরিশাল', 'available'),
('করিম', 'শাহীওয়াল', 440.00, 3, 175000.00, 'বড় আকারের শাহীওয়াল গরু। চমৎকার শারীরিক গঠন।', ARRAY['/placeholder.svg?height=400&width=600'], 'https://example.com/video5.mp4', 'ময়মনসিংহ', 'available'),
('রহিম', 'দেশি', 340.00, 2, 130000.00, 'দেশি জাতের সুস্থ এবং সবল গরু।', ARRAY['/placeholder.svg?height=400&width=600'], NULL, 'রংপুর', 'available'),
('হাসান', 'ব্রাহমা', 460.00, 4, 185000.00, 'প্রিমিয়াম মানের ব্রাহমা জাতের গরু। কুরবানির জন্য আদর্শ।', ARRAY['/placeholder.svg?height=400&width=600'], 'https://example.com/video6.mp4', 'ঢাকা', 'available');
