-- Create projects table for crowdfunding projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goal_amount DECIMAL(12, 2) NOT NULL,
  raised_amount DECIMAL(12, 2) DEFAULT 0,
  investor_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  deadline DATE NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample projects
INSERT INTO projects (title, description, goal_amount, raised_amount, investor_count, status, deadline, image_url) VALUES
('গরুর খামার সম্প্রসারণ ২০২৫', 'আমাদের গরুর খামার সম্প্রসারণের জন্য বিনিয়োগ প্রয়োজন। নতুন শেড নির্মাণ এবং আরও গরু ক্রয়ের জন্য তহবিল সংগ্রহ করা হচ্ছে।', 5000000.00, 3750000.00, 45, 'active', '2025-06-30', '/placeholder.svg?height=300&width=500'),
('জৈব খাদ্য উৎপাদন প্রকল্প', 'গরুর জন্য জৈব খাদ্য উৎপাদনের প্রকল্প। এতে গরুর স্বাস্থ্য ভালো থাকবে এবং মাংসের মান উন্নত হবে।', 3000000.00, 2400000.00, 32, 'active', '2025-05-15', '/placeholder.svg?height=300&width=500'),
('আধুনিক পশু চিকিৎসা কেন্দ্র', 'খামারে আধুনিক পশু চিকিৎসা কেন্দ্র স্থাপনের জন্য বিনিয়োগ। এতে গরুর স্বাস্থ্যসেবা উন্নত হবে।', 2000000.00, 1800000.00, 28, 'active', '2025-04-30', '/placeholder.svg?height=300&width=500'),
('কুরবানি ২০২৪ প্রকল্প', 'গত বছরের সফল কুরবানি প্রকল্প। সকল বিনিয়োগকারী লাভ পেয়েছেন।', 4000000.00, 4000000.00, 50, 'completed', '2024-07-15', '/placeholder.svg?height=300&width=500');
