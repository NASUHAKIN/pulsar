# Ürün Analiz & Feature Listesi

## 1. Ürün Tanımı
Google Antigravity, ekiplerin haftalık yazılı durum güncellemelerini otomatik toplamak, konsolide etmek ve yöneticilere sade bir özet sunmak için tasarlanmış, tek amaçlı async check-in aracıdır.
Tüm iletişim e-posta üzerinden akar ve herhangi bir uygulama kurulumuna ihtiyaç duymaz.

## 2. Değer Önerisi
- Haftada bir alınan net yazılı güncellemeler sayesinde toplantı ihtiyacını azaltır.
- Takım içi hedef netliği ve hesap verebilirliği artırır.
- Her ekip üyesinin katkısını görünür hâle getirir.

## 3. Ana Kullanım Akışı
1. Yönetici bir ekip oluşturur.
2. Ekip üyelerine her hafta otomatik bir e-posta gider.
3. Kullanıcı, e-postadaki linkle 1 dakikalık formu doldurur.
4. Tüm yanıtlar yöneticinin inbox'ına tek bir konsolide e-posta olarak düşer.
5. Gerekirse takımın tümüne dağıtılır.

## 4. Güçlü Yanlar
- **Sıfır sürtünme:** Login yok, uygulama yok, sadece link.
- **Radikal sadelik:** Tek kullanım senaryosuna (weekly check-in) odaklanır.
- **E-posta-first:** Kullanıcıların zaten en çok kullandığı kanal üzerinden çalışır.
- **Hızlı kurulum:** 3–5 dakika içinde ekip hazır.
- **Net yöneticilik faydası:** Tüm güncellemeler tek mesajda.

## 5. Zayıf Yanlar / Fırsat Alanları
- Sadece e-posta üzerinden çalışması → modern ekiplerde Slack/Teams entegrasyonu eksik.
- Analitik görünürlük zayıf → Submit rate, trendler, risk temaları yok.
- AI destekli özetler yok → Yöneticinin yükü hâlâ manuel.
- Ritim sadece “weekly” → daily, monthly, quarter-review gibi formatlar yok.
- Fiyatlandırmada orta segment seçenek az.

## 6. Ürün Geliştirme Önerileri

### A. Dashboard & Analitik
**Kişi / takım bazında:**
- Submit rate
- Gecikme oranı
- Ortalama kelime sayısı
- Risk/engel frekansı
- Basit haftalık trend grafiği

**Yöneticiler için:** "top 3 risk", "bu hafta kim neyi tamamladı" gibi mini özetler

### B. AI Destekli Özellikler
**Her hafta yöneticilere otomatik:**
- Haftanın 3 maddelik özeti
- Gündeme alınması gereken risk/engel listesi

**Çalışanlara:**
- “Bu hafta öne çıkan katkıların” mini geri bildirim maili

### C. Esnek Check-in Formatları
- Daily standup
- Weekly update
- Monthly progress
- OKR forecast / risk erken uyarı
- Proje bazlı (Engineering, Product, Sales) hazır şablonlar

## 7. Kanal / Entegrasyon Önerileri

### Slack & Teams
- Check-in hatırlatmalarını DM olarak gönderme
- Formu direkt mesaj içinde açma
- Sonuçları ilgili kanala özet olarak post etme
- `/antigravity weekly` komutu ile o haftanın raporunu çekme

### Task & Calendar
- Google Calendar / Outlook ile deadline bazlı akıllı hatırlatma
- Jira / GitHub / Linear aktivitelerini otomatik tarayıp taslak oluşturma
- Google Docs / Sheets ile export entegrasyonu

## 8. Fiyatlandırma Önerileri

### Entry Plan (Free)
- 1 takım
- 5 kullanıcı
- Haftalık check-in

### Growth Plan (19$/ay)
- 25 kullanıcı
- 3 takım
- Basit dashboard
- Slack entegrasyonu

### Pro Plan (49$/ay)
- Sınırsız kullanıcı
- Sınırsız takım
- AI özetler
- Gelişmiş entegrasyonlar
- Priority support

### Manager-Centric Licensing
- 5$/manager/ay
- Sınırsız ekip üyesi
- Tek yöneticili küçük ekipler için çok doğal fiyat algısı

## 9. UX / Deneyim İyileştirme Önerileri
- Onboarding’de sektöre göre hazır şablonlar (PM, Sales, Eng).
- İlk 2 hafta için otomatik önerilen soru setleri.
- Kullanıcıya geçmiş cevaplarını gösterip “ilerleme hissi” yaratma.
- Takım içi “kudos/shout-out” alanı ile takdir kültürünü destekleme.
- Dark/light tema, daha modern mail layout’ları.
