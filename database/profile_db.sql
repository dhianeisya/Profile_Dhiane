-- =========================================
-- DATABASE: profile_db (Supabase PostgreSQL)
-- =========================================

DROP TABLE IF EXISTS artikel;
DROP TABLE IF EXISTS users;

-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password)
VALUES
('admin', 'admin123'),
('user', 'user123');

-- =========================================
-- ARTIKEL
-- =========================================

CREATE TABLE artikel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judul VARCHAR(255),
    isi TEXT,
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO artikel (judul, isi, tanggal)
VALUES (
'Pentingnya Literasi Digital di Era Modern',
'Di era digital saat ini, teknologi telah menjadi bagian yang tidak terpisahkan dari kehidupan sehari-hari. Hampir semua aktivitas, mulai dari belajar, bekerja, hingga berkomunikasi, memanfaatkan internet dan perangkat digital. Oleh karena itu, literasi digital menjadi keterampilan yang sangat penting untuk dimiliki oleh setiap individu.

Literasi digital adalah kemampuan untuk memahami, menggunakan, dan mengevaluasi informasi yang diperoleh melalui media digital secara bijak dan bertanggung jawab. Dengan literasi digital yang baik, seseorang dapat membedakan informasi yang benar dan hoaks, menjaga keamanan data pribadi, serta menggunakan teknologi untuk hal-hal yang positif dan produktif.

Selain itu, literasi digital juga membantu meningkatkan kemampuan belajar dan bekerja. Berbagai sumber informasi dan aplikasi dapat dimanfaatkan untuk menambah pengetahuan, mengembangkan keterampilan, serta meningkatkan efisiensi dalam menyelesaikan tugas.

Dengan demikian, literasi digital tidak hanya menjadi kebutuhan, tetapi juga bekal penting untuk menghadapi tantangan di era modern. Masyarakat perlu terus meningkatkan kemampuan literasi digital agar dapat memanfaatkan teknologi secara cerdas, aman, dan bertanggung jawab.',
'2026-05-30 15:19:01'
);