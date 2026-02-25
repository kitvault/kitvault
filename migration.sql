-- ═══════════════════════════════════════════════════════
-- KitVault Static Kits → D1 Migration
-- Generated: 2026-02-25T12:44:11.531Z
-- Total kits: 589
-- ═══════════════════════════════════════════════════════

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('EG', '1/144', 'Action Base 1 Black', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/eg-unk-action-base-1-black-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='EG' AND scale='1/144' AND name='Action Base 1 Black' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('EG', '1/144', 'Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/eg-unk-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='EG' AND scale='1/144' AND name='Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('EG', '1/144', 'Gundam (entry Grade)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/eg-unk-gundam-entry-grade-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='EG' AND scale='1/144' AND name='Gundam (entry Grade)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('EG', '1/144', 'Rx-78-2 Gundam (entry Grade VER.)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/eg-unk-rx-78-2-gundam-entry-grade-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='EG' AND scale='1/144' AND name='Rx-78-2 Gundam (entry Grade VER.)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('EG', '1/144', 'Rx-78-2 Gundam (wolf Weapon Set)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/eg-unk-rx-78-2-gundam-wolf-weapon-set-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='EG' AND scale='1/144' AND name='Rx-78-2 Gundam (wolf Weapon Set)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('EG', '1/144', 'Rx78-2 Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/eg-unk-rx78-2-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='EG' AND scale='1/144' AND name='Rx78-2 Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('EG', '1/144', 'Strike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/eg-unk-strike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='EG' AND scale='1/144' AND name='Strike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('EG', '1/144', 'Strike Gundam (seed Package VER.)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/eg-unk-strike-gundam-seed-package-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='EG' AND scale='1/144' AND name='Strike Gundam (seed Package VER.)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', '1.5 Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-1-5-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='1.5 Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Abyss Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-abyss-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Abyss Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Action Base 2 Black', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-action-base-2-black-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Action Base 2 Black' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Action Base Mini', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-action-base-mini-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Action Base Mini' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Action Base Ⅱ Black', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-action-base-black-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Action Base Ⅱ Black' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Actionbase 6 (clear Color)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-actionbase-6-clear-color-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Actionbase 6 (clear Color)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Aegis Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-aegis-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Aegis Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Al Saachez''s Aeu Enact Custom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-al-saachez-s-aeu-enact-custom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Al Saachez''s Aeu Enact Custom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Amazing Booster Zaku Amazing Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-amazing-booster-zaku-amazing-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Amazing Booster Zaku Amazing Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Amazing Strike Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-amazing-strike-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Amazing Strike Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Amazing Weapon Binder Build Fighters Support Weapon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-amazing-weapon-binder-build-fighters-support-weapon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Amazing Weapon Binder Build Fighters Support Weapon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Amida''s Macuren', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-amida-s-macuren-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Amida''s Macuren' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ams-119 Geara Doga Neo Zeon Mass Productive Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ams-119-geara-doga-neo-zeon-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ams-119 Geara Doga Neo Zeon Mass Productive Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ams-129 Geara Zulu (angelo Sauper Use)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ams-129-geara-zulu-angelo-sauper-use-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ams-129 Geara Zulu (angelo Sauper Use)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ams-129 Geara Zulu (guards Type)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ams-129-geara-zulu-guards-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ams-129 Geara Zulu (guards Type)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ams-129 Geara Zulu Neo Zeon Mass-productive Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ams-129-geara-zulu-neo-zeon-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ams-129 Geara Zulu Neo Zeon Mass-productive Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ams-129m Zee Zulu (neo Zeon Mass-produced Amphibious Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ams-129m-zee-zulu-neo-zeon-mass-produced-amphibious-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ams-129m Zee Zulu (neo Zeon Mass-produced Amphibious Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Amx-002 Neue Ziel', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-amx-002-neue-ziel-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Amx-002 Neue Ziel' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Amx-003 Gaza C Axis Mass Productive Transformable Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-amx-003-gaza-c-axis-mass-productive-transformable-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Amx-003 Gaza C Axis Mass Productive Transformable Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Amx-009 Dreissen (unicorn VER.)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-amx-009-dreissen-unicorn-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Amx-009 Dreissen (unicorn VER.)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Amx-014 Döven Wolf Neo Zeon Quasi Psycommu Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-amx-014-d-ven-wolf-neo-zeon-quasi-psycommu-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Amx-014 Döven Wolf Neo Zeon Quasi Psycommu Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ballden Arm Arms (build Fighters Support Unit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ballden-arm-arms-build-fighters-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ballden Arm Arms (build Fighters Support Unit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Beargguy (plaretti)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-beargguy-plaretti-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Beargguy (plaretti)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Big Gun Gundam Thunderbolt VER.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-big-gun-gundam-thunderbolt-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Big Gun Gundam Thunderbolt VER.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Binder Gun Build Divers Support Weapon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-binder-gun-build-divers-support-weapon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Binder Gun Build Divers Support Weapon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Blast Impulse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-blast-impulse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Blast Impulse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Blaze Zaku Phantom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-blaze-zaku-phantom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Blaze Zaku Phantom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Blaze Zaku Phantom (ray''s Barrel Custom)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-blaze-zaku-phantom-ray-s-barrel-custom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Blaze Zaku Phantom (ray''s Barrel Custom)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Blitz Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-blitz-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Blitz Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Blu Duel Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-blu-duel-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Blu Duel Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Build Booster Mk-ii Build Gundam Mk-ii Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-build-booster-mk-ii-build-gundam-mk-ii-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Build Booster Mk-ii Build Gundam Mk-ii Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Build Custom GP Base Gunpla Display Base', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-build-custom-gp-base-gunpla-display-base-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Build Custom GP Base Gunpla Display Base' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Build Gundam Mk-ii (build Fighter Set Jori Custom Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-build-gundam-mk-ii-build-fighter-set-jori-custom-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Build Gundam Mk-ii (build Fighter Set Jori Custom Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Build Hands Edge (s.m.l)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-build-hands-edge-s-m-l-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Build Hands Edge (s.m.l)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Build Hands Round (s.m.l)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-build-hands-round-s-m-l-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Build Hands Round (s.m.l)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Build Strike Exia Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-build-strike-exia-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Build Strike Exia Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Build Strike Galaxy Cosmos', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-build-strike-galaxy-cosmos-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Build Strike Galaxy Cosmos' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Build Strike Gundam Full Package', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-build-strike-gundam-full-package-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Build Strike Gundam Full Package' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Buster Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-buster-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Buster Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Buster Gundam (gat-x103 Buster Gundam)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-buster-gundam-gat-x103-buster-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Buster Gundam (gat-x103 Buster Gundam)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Calamity Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-calamity-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Calamity Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Changeling Rifle', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-changeling-rifle-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Changeling Rifle' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Chaos Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-chaos-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Chaos Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Cherudim Gundam Saga Type Gbf Inspection Model', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-cherudim-gundam-saga-type-gbf-inspection-model-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Cherudim Gundam Saga Type Gbf Inspection Model' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Cheruydim Gundam Gnh-w/r', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-cheruydim-gundam-gnh-w-r-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Cheruydim Gundam Gnh-w/r' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Chimasguy', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-chimasguy-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Chimasguy' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Civilian Astray Dssd Custom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-civilian-astray-dssd-custom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Civilian Astray Dssd Custom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'D-50c Loto Twin Set E.f.s.f. Special Operations Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-d-50c-loto-twin-set-e-f-s-f-special-operations-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='D-50c Loto Twin Set E.f.s.f. Special Operations Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Dahack', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-dahack-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Dahack' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Dark Matter Booster Gundam Exia Dark Matter Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-dark-matter-booster-gundam-exia-dark-matter-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Dark Matter Booster Gundam Exia Dark Matter Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Denial Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-denial-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Denial Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Destiny Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-destiny-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Destiny Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Diver Ace Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-diver-ace-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Diver Ace Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Diver Ayame', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-diver-ayame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Diver Ayame' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Diver Gear Gunpla Display Base', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-diver-gear-gunpla-display-base-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Diver Gear Gunpla Display Base' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Dom R35', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-dom-r35-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Dom R35' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Dreadnought Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-dreadnought-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Dreadnought Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Dualey Papillon Build Fighter Ails Eyetalker Custom Made Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-dualey-papillon-build-fighter-ails-eyetalker-custom-made-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Dualey Papillon Build Fighter Ails Eyetalker Custom Made Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Duel Gundam Assaulthroud', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-duel-gundam-assaulthroud-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Duel Gundam Assaulthroud' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Elf Bullock (masc Exclusive)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-elf-bullock-masc-exclusive-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Elf Bullock (masc Exclusive)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'F91 Funoichihai', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-f91-funoichihai-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='F91 Funoichihai' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Fa-78 Full Armor Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-fa-78-full-armor-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Fa-78 Full Armor Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Fa-78-3 Fullarmor Gundam 7th (e.f.s.f. Prototype Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-fa-78-3-fullarmor-gundam-7th-e-f-s-f-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Fa-78-3 Fullarmor Gundam 7th (e.f.s.f. Prototype Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Fd-03-00 Gustav Karl Type-00', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-fd-03-00-gustav-karl-type-00-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Fd-03-00 Gustav Karl Type-00' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Fe-b0', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-fe-b0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Fe-b0' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Forbidden Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-forbidden-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Forbidden Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Force Impulse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-force-impulse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Force Impulse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Force Impulse Gundam +sword Silhouette (extra Finish Version)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-force-impulse-gundam-sword-silhouette-extra-finish-version-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Force Impulse Gundam +sword Silhouette (extra Finish Version)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'G-bouncer (wms-gb5)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-g-bouncer-wms-gb5-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='G-bouncer (wms-gb5)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gaeon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gaeon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gaeon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gaia Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gaia-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gaia Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Galbaldy Rebake', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-galbaldy-rebake-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Galbaldy Rebake' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-o2l2 Dagger L', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-o2l2-dagger-l-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-o2l2 Dagger L' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x102 Duel Gundam Assaultshroud', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x102-duel-gundam-assaultshroud-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x102 Duel Gundam Assaultshroud' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x103 Buster Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x103-buster-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x103 Buster Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x105 Aile Strike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x105-aile-strike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x105 Aile Strike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x105 Launcher Strike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x105-launcher-strike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x105 Launcher Strike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x105 Sword Strike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x105-sword-strike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x105 Sword Strike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x131 Calamity Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x131-calamity-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x131 Calamity Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x207 Blitz Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x207-blitz-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x207 Blitz Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x252 Forbidden Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x252-forbidden-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x252 Forbidden Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x303 Aegis Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x303-aegis-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x303 Aegis Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gat-x370 Raider Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gat-x370-raider-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gat-x370 Raider Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gbn-guard Frame', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gbn-guard-frame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gbn-guard Frame' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gearh Ghirarga', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gearh-ghirarga-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gearh Ghirarga' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Geirail', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-geirail-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Geirail' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Genoace (rge-b790)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-genoace-rge-b790-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Genoace (rge-b790)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gf13-017njii G Gundam Neo Japan Mobile Fighter', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gf13-017njii-g-gundam-neo-japan-mobile-fighter-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gf13-017njii G Gundam Neo Japan Mobile Fighter' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Giant Gatling Build Fighters Support Weapon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-giant-gatling-build-fighters-support-weapon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Giant Gatling Build Fighters Support Weapon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Glaive Dain', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-glaive-dain-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Glaive Dain' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gm Sniper K9', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gm-sniper-k9-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gm Sniper K9' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gn Archer', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gn-archer-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gn Archer' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gn-0000+gnr-010 Oo Raiser (double O Raiser)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gn-0000-gnr-010-oo-raiser-double-o-raiser-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gn-0000+gnr-010 Oo Raiser (double O Raiser)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gn-006 Cherudim Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gn-006-cherudim-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gn-006 Cherudim Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gnx-y901tw Susanowo (trans-am Mode)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gnx-y901tw-susanowo-trans-am-mode-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gnx-y901tw Susanowo (trans-am Mode)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gnz-005 Garazzo', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gnz-005-garazzo-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gnz-005 Garazzo' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gouf Hugo', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gouf-hugo-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gouf Hugo' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Graze (standard Type/commander Type)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-graze-standard-type-commander-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Graze (standard Type/commander Type)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Graze Custom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-graze-custom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Graze Custom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Graze Ritter (calta Machine)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-graze-ritter-calta-machine-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Graze Ritter (calta Machine)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Grimbgerde', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-grimbgerde-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Grimbgerde' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gunblaster Starter Set Vol.2', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gunblaster-starter-set-vol-2-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gunblaster Starter Set Vol.2' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam 00 Diver Ace', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-00-diver-ace-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam 00 Diver Ace' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam 00 Sky (higher Than Sky Phase)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-00-sky-higher-than-sky-phase-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam 00 Sky (higher Than Sky Phase)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam 00 Sky Hws (trans-am Infinity Mode)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-00-sky-hws-trans-am-infinity-mode-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam 00 Sky Hws (trans-am Infinity Mode)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam 00-67 Gundam Zabanya', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-00-67-gundam-zabanya-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam 00-67 Gundam Zabanya' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Age II Magnum Sv VER.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-age-ii-magnum-sv-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Age II Magnum Sv VER.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Age-1 Spallow [age-1s]', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-age-1-spallow-age-1s-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Age-1 Spallow [age-1s]' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Age-2 Double Bullet [age-2db]', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-age-2-double-bullet-age-2db-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Age-2 Double Bullet [age-2db]' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Age-2 Normal (age-2)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-age-2-normal-age-2-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Age-2 Normal (age-2)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Ages II Magnum Kyoja Kujos Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-ages-ii-magnum-kyoja-kujos-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Ages II Magnum Kyoja Kujos Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astaroth', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astaroth-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astaroth' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astaroth Origin', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astaroth-origin-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astaroth Origin' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astaroth Rinascimento', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astaroth-rinascimento-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astaroth Rinascimento' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astraea', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astraea-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astraea' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astray Blue Frame', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astray-blue-frame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astray Blue Frame' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astray Blue Frame Second L', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astray-blue-frame-second-l-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astray Blue Frame Second L' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astray Green Frame', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astray-green-frame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astray Green Frame' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astray Mirage Frame', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astray-mirage-frame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astray Mirage Frame' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astray No-name', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astray-no-name-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astray No-name' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Astray Red Frame', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-astray-red-frame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Astray Red Frame' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Avalanche Exia', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-avalanche-exia-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Avalanche Exia' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Barbatos', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-barbatos-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Barbatos' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Barbatos & Long Distance Transport Booster Kutan Type-iii', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-barbatos-long-distance-transport-booster-kutan-type-iii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Barbatos & Long Distance Transport Booster Kutan Type-iii' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Barbatos (standard Series)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-barbatos-standard-series-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Barbatos (standard Series)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Barbatos 6th Form', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-barbatos-6th-form-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Barbatos 6th Form' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Barbatos Lupus', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-barbatos-lupus-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Barbatos Lupus' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Barbatos Lupus Rex', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-barbatos-lupus-rex-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Barbatos Lupus Rex' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Calibarn', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-calibarn-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Calibarn' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Dantalion', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-dantalion-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Dantalion' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Dark Phantom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-dark-phantom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Dark Phantom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Exia Dark Matter', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-exia-dark-matter-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Exia Dark Matter' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Exia Voda', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-exia-voda-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Exia Voda' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Flauros (fluorspar)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-flauros-fluorspar-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Flauros (fluorspar)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam G-arcane', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-g-arcane-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam G-arcane' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam G-self', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-g-self-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam G-self' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam G-self Assault Pack', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-g-self-assault-pack-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam G-self Assault Pack' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam G40 (industrial Design VER.)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-g40-industrial-design-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam G40 (industrial Design VER.)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Gusion', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-gusion-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Gusion' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Gusion Rebake', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-gusion-rebake-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Gusion Rebake' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Ha Unicorn', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-ha-unicorn-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Ha Unicorn' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Joan Altron', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-joan-altron-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Joan Altron' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Kimaris', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-kimaris-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Kimaris' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Kimaris Trooper', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-kimaris-trooper-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Kimaris Trooper' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Leopard Da Vinci', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-leopard-da-vinci-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Leopard Da Vinci' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Oo Shia Qanti', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-oo-shia-qanti-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Oo Shia Qanti' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Operation V', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-operation-v-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Operation V' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Schwarzette', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-schwarzette-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Schwarzette' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Schwarzritter', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-schwarzritter-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Schwarzritter' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Shining Break', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-shining-break-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Shining Break' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Sumo (reraise Full City)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-sumo-reraise-full-city-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Sumo (reraise Full City)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Tayon 3', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-tayon-3-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Tayon 3' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam The End', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-the-end-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam The End' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Vdar', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-vdar-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Vdar' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Vidar', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-vidar-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Vidar' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam X Maoh (build Fighter Mag Yasaka Custom Made Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-x-maoh-build-fighter-mag-yasaka-custom-made-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam X Maoh (build Fighter Mag Yasaka Custom Made Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Zerachiel (ain Sophia''s Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gundam-zerachiel-ain-sophia-s-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Zerachiel (ain Sophia''s Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gunner Zaku Warrior', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gunner-zaku-warrior-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gunner Zaku Warrior' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gunner Zaku Warrior (lusmaria Horn Equipped)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gunner-zaku-warrior-lusmaria-horn-equipped-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gunner Zaku Warrior (lusmaria Horn Equipped)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gunpla Battle Arm Arms Build Fighters Support Weapon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gunpla-battle-arm-arms-build-fighters-support-weapon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gunpla Battle Arm Arms Build Fighters Support Weapon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gx-9900 Gundam X Satellite System Loading Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gx-9900-gundam-x-satellite-system-loading-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gx-9900 Gundam X Satellite System Loading Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gx-9900-dv Gundam X Divider (divider-equipped Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gx-9900-dv-gundam-x-divider-divider-equipped-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gx-9900-dv Gundam X Divider (divider-equipped Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gya Eastern Weapons', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gya-eastern-weapons-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gya Eastern Weapons' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gyanglot', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-gyanglot-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gyanglot' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Haro', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-haro-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Haro' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Helmsguide Enryuku', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-helmsguide-enryuku-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Helmsguide Enryuku' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Hexua', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-hexua-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Hexua' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Hiyakuri (1/144 Scale Model)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-hiyakuri-1-144-scale-model-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Hiyakuri (1/144 Scale Model)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Hws & Sv Custom Weapon Set Build Divers Support Weapon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-hws-sv-custom-weapon-set-build-divers-support-weapon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Hws & Sv Custom Weapon Set Build Divers Support Weapon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Hyaku-shiki + ''mega Bazooka Launcher'' A.e.u.g. Attack Use Prototype Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-hyaku-shiki-mega-bazooka-launcher-a-e-u-g-attack-use-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Hyaku-shiki + ''mega Bazooka Launcher'' A.e.u.g. Attack Use Prototype Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Hyakuren', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-hyakuren-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Hyakuren' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Hyper Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-hyper-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Hyper Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Hyper Gunpla Battle Weapons Build Fighters Support Weapon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-hyper-gunpla-battle-weapons-build-fighters-support-weapon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Hyper Gunpla Battle Weapons Build Fighters Support Weapon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Impulse Gundam Arc', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-impulse-gundam-arc-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Impulse Gundam Arc' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Impulse Gundam Lancier', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-impulse-gundam-lancier-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Impulse Gundam Lancier' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Jegan Blast Master Yuki''s Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-jegan-blast-master-yuki-s-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Jegan Blast Master Yuki''s Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Jigen Build Knuckles ''kaku''', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-jigen-build-knuckles-kaku-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Jigen Build Knuckles ''kaku''' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Jigen Build Knuckles (round)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-jigen-build-knuckles-round-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Jigen Build Knuckles (round)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Julieta''s Mobile Suginaze', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-julieta-s-mobile-suginaze-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Julieta''s Mobile Suginaze' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Justice Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-justice-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Justice Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'K9 Dog Pack (gm Sniper K9 Support Unit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-k9-dog-pack-gm-sniper-k9-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='K9 Dog Pack (gm Sniper K9 Support Unit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Kabakali', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-kabakali-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Kabakali' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Kampfer Amazing', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-kampfer-amazing-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Kampfer Amazing' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Launcher Strike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-launcher-strike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Launcher Strike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Leo Npd (new Player Diver''s Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-leo-npd-new-player-diver-s-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Leo Npd (new Player Diver''s Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Lg-gat-x105 Gale Strike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-lg-gat-x105-gale-strike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Lg-gat-x105 Gale Strike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Lh-gat-x103 Hail Buster Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-lh-gat-x103-hail-buster-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Lh-gat-x103 Hail Buster Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Lightning Back Weapon System Mk-iii', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-lightning-back-weapon-system-mk-iii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Lightning Back Weapon System Mk-iii' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Lightning Z Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-lightning-z-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Lightning Z Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Lr-gat-x102 Regen Duel Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-lr-gat-x102-regen-duel-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Lr-gat-x102 Regen Duel Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Lu-2gmf-x23s Dent Saviour Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-lu-2gmf-x23s-dent-saviour-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Lu-2gmf-x23s Dent Saviour Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Lunagazer Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-lunagazer-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Lunagazer Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'M1 Astray', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-m1-astray-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='M1 Astray' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ma-06 Val-walo', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ma-06-val-walo-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ma-06 Val-walo' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Machine Rider Build Divers Support Mecha', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-machine-rider-build-divers-support-mecha-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Machine Rider Build Divers Support Mecha' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mack Knife', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mack-knife-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mack Knife' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Matsuri Weapon Build Fighters Support Weapon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-matsuri-weapon-build-fighters-support-weapon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Matsuri Weapon Build Fighters Support Weapon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mbf-p01 Gundam Astray Gold Frame', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mbf-p01-gundam-astray-gold-frame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mbf-p01 Gundam Astray Gold Frame' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mbf-p03lm Gundam Astray Mirage Frame', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mbf-p03lm-gundam-astray-mirage-frame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mbf-p03lm Gundam Astray Mirage Frame' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Meo2r-fo1 Messer Type-fo1 (mafty Mass-produced Heavy Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-meo2r-fo1-messer-type-fo1-mafty-mass-produced-heavy-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Meo2r-fo1 Messer Type-fo1 (mafty Mass-produced Heavy Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Meteor Hopper Wing Gundam Fenice Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-meteor-hopper-wing-gundam-fenice-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Meteor Hopper Wing Gundam Fenice Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Meteor Unit + Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-meteor-unit-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Meteor Unit + Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Miss Sazabi', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-miss-sazabi-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Miss Sazabi' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Armor Hashmal', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mobile-armor-hashmal-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Armor Hashmal' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Cque Zgmf-515 Gundam Seed-15', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mobile-cque-zgmf-515-gundam-seed-15-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Cque Zgmf-515 Gundam Seed-15' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Dinn', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mobile-dinn-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Dinn' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Doll Sarah', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mobile-doll-sarah-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Doll Sarah' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Gigue', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mobile-gigue-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Gigue' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Ginn (zgmf-1017 Mobile Suit Gundam Seed)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mobile-ginn-zgmf-1017-mobile-suit-gundam-seed-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Ginn (zgmf-1017 Mobile Suit Gundam Seed)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Goohm', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mobile-goohm-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Goohm' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Suit Option Set 8 & Sau Mobile Worker', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mobile-suit-option-set-8-sau-mobile-worker-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Suit Option Set 8 & Sau Mobile Worker' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Montero', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-montero-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Montero' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mrs. Loheng-rinko', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mrs-loheng-rinko-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mrs. Loheng-rinko' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mrx-009 ''psycho Gundam'' Titans Prototype Transformable Mobile Armor', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-mrx-009-psycho-gundam-titans-prototype-transformable-mobile-armor-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mrx-009 ''psycho Gundam'' Titans Prototype Transformable Mobile Armor' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'MS Option Set 1 & Cgs Mobile Worker', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-option-set-1-cgs-mobile-worker-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='MS Option Set 1 & Cgs Mobile Worker' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'MS Option Set 2 & Cgs Mobile Worker (space Type)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-option-set-2-cgs-mobile-worker-space-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='MS Option Set 2 & Cgs Mobile Worker (space Type)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'MS Option Set 3 & Gallarhorn Mobile Worker', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-option-set-3-gallarhorn-mobile-worker-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='MS Option Set 3 & Gallarhorn Mobile Worker' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'MS Option Set 4 & Union Mobile Worker', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-option-set-4-union-mobile-worker-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='MS Option Set 4 & Union Mobile Worker' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'MS Option Set 5 & Tekkadan Mobile Worker', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-option-set-5-tekkadan-mobile-worker-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='MS Option Set 5 & Tekkadan Mobile Worker' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'MS Option Set 6 & Hd Mobile Worker', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-option-set-6-hd-mobile-worker-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='MS Option Set 6 & Hd Mobile Worker' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'MS Option Set 7', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-option-set-7-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='MS Option Set 7' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'MS Option Set 9', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-option-set-9-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='MS Option Set 9' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-05 Zaku I Gundam Thunderbolt VER.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-05-zaku-i-gundam-thunderbolt-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-05 Zaku I Gundam Thunderbolt VER.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06 Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06 Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06 Zaku II Principality Of Zeon Mass-produced Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06-zaku-ii-principality-of-zeon-mass-produced-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06 Zaku II Principality Of Zeon Mass-produced Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06f Zakuii F Type Solar (rfy) Principality Of Zeon Mass-produced Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06f-zakuii-f-type-solar-rfy-principality-of-zeon-mass-produced-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06f Zakuii F Type Solar (rfy) Principality Of Zeon Mass-produced Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06f-2 Zaku II F2 (e.f.s.f. Mass Productive Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06f-2-zaku-ii-f2-e-f-s-f-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06f-2 Zaku II F2 (e.f.s.f. Mass Productive Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06f-2 Zaku II F2 Principality Of Zeon Mass Productive Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06f-2-zaku-ii-f2-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06f-2 Zaku II F2 Principality Of Zeon Mass Productive Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06fz Zaku II Fz (principality Of Zeon Mass Productive Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06fz-zaku-ii-fz-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06fz Zaku II Fz (principality Of Zeon Mass Productive Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06r Zakuii High Mobility Type \"psycho Zaku\" Gundam Thunderbolt VER.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06r-zakuii-high-mobility-type-psycho-zaku-gundam-thunderbolt-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06r Zakuii High Mobility Type \"psycho Zaku\" Gundam Thunderbolt VER.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06s ''zaku Ii'' (principality Of Zeon Char''s Customize Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06s-zaku-ii-principality-of-zeon-char-s-customize-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06s ''zaku Ii'' (principality Of Zeon Char''s Customize Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-06s Zaku II (principality Of Zeon Char Aznable''s Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-06s-zaku-ii-principality-of-zeon-char-aznable-s-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-06s Zaku II (principality Of Zeon Char Aznable''s Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-07b-3 Gouf Custom (principality Of Zeon Ground Battle Type Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-07b-3-gouf-custom-principality-of-zeon-ground-battle-type-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-07b-3 Gouf Custom (principality Of Zeon Ground Battle Type Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-09 Challia''s Rick Dom (gq)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-09-challia-s-rick-dom-gq-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-09 Challia''s Rick Dom (gq)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-14a Gelgoog / Ms-14c Gelgoog Cannon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-14a-gelgoog-ms-14c-gelgoog-cannon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-14a Gelgoog / Ms-14c Gelgoog Cannon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-14s Gelgoog (principality Of Zeon Char''s Customize Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-14s-gelgoog-principality-of-zeon-char-s-customize-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-14s Gelgoog (principality Of Zeon Char''s Customize Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-18e Kämpfer (principality Of Zeon Assault Use Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-18e-k-mpfer-principality-of-zeon-assault-use-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-18e Kämpfer (principality Of Zeon Assault Use Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ms-21c Dra-c Principality Of Zeon Mass-produced Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ms-21c-dra-c-principality-of-zeon-mass-produced-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ms-21c Dra-c Principality Of Zeon Mass-produced Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Msa-005 Methuss (a.e.u.c. Prototype Attack Use Transformable Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-msa-005-methuss-a-e-u-c-prototype-attack-use-transformable-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Msa-005 Methuss (a.e.u.c. Prototype Attack Use Transformable Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Msm-03 ''gogg''', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-msm-03-gogg-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Msm-03 ''gogg''' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Msm-04 Acguy (principality Of Zeon Mass Productive Amphibious Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-msm-04-acguy-principality-of-zeon-mass-productive-amphibious-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Msm-04 Acguy (principality Of Zeon Mass Productive Amphibious Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Msm-10 Zock Principality Of Zeon Proto-type Amphibious Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-msm-10-zock-principality-of-zeon-proto-type-amphibious-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Msm-10 Zock Principality Of Zeon Proto-type Amphibious Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Msn-03 Jagd Doga Neo Zeon Mobile Suit For Newtype', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-msn-03-jagd-doga-neo-zeon-mobile-suit-for-newtype-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Msn-03 Jagd Doga Neo Zeon Mobile Suit For Newtype' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Msn-04ii Nightingale Neo Zeon Char Aznable''s Use Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-msn-04ii-nightingale-neo-zeon-char-aznable-s-use-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Msn-04ii Nightingale Neo Zeon Char Aznable''s Use Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Msz-006 ''zeta Gundam'' A.e.u.g. Prototype Transformable Attack Use Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-msz-006-zeta-gundam-a-e-u-g-prototype-transformable-attack-use-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Msz-006 ''zeta Gundam'' A.e.u.g. Prototype Transformable Attack Use Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ninpulse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ninpulse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ninpulse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Nix Providence Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-nix-providence-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Nix Providence Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'No-name Rifle (build Divers Support Weapon)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-no-name-rifle-build-divers-support-weapon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='No-name Rifle (build Divers Support Weapon)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Nrx-044 Asshimar E.f.f. Prototype Transformable Mobile Armor', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-nrx-044-asshimar-e-f-f-prototype-transformable-mobile-armor-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Nrx-044 Asshimar E.f.f. Prototype Transformable Mobile Armor' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Orb-01 Akatsuki Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-orb-01-akatsuki-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Orb-01 Akatsuki Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ork-005 ''gaplant'' E.f.s.f. Prototype Transformable Mobile Armor', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ork-005-gaplant-e-f-s-f-prototype-transformable-mobile-armor-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ork-005 ''gaplant'' E.f.s.f. Prototype Transformable Mobile Armor' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Overname', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-overname-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Overname' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Pmx-001 Palace-athene Jupitoris Prototype Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-pmx-001-palace-athene-jupitoris-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Pmx-001 Palace-athene Jupitoris Prototype Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Portent Flyer Build Fighters Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-portent-flyer-build-fighters-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Portent Flyer Build Fighters Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Providence Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-providence-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Providence Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Ptolemaios Arms', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-ptolemaios-arms-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Ptolemaios Arms' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Raider Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-raider-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Raider Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Raider Gundam (gat-x370 レイダーガンダム)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-raider-gundam-gat-x370-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Raider Gundam (gat-x370 レイダーガンダム)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Reginlaze Julia', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-reginlaze-julia-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Reginlaze Julia' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rgm-79 Gm (shoulder Cannon / Missile-pod)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rgm-79-gm-shoulder-cannon-missile-pod-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rgm-79 Gm (shoulder Cannon / Missile-pod)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rgm-79 Gm Gundam Thunderbolt VER.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rgm-79-gm-gundam-thunderbolt-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rgm-79 Gm Gundam Thunderbolt VER.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rgm-79 Powered Gm E.f.s.f. Mass Productive Mobile Suit Custom Type', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rgm-79-powered-gm-e-f-s-f-mass-productive-mobile-suit-custom-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rgm-79 Powered Gm E.f.s.f. Mass Productive Mobile Suit Custom Type' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rgm-86r Gmiii E.f.s.f. Mass-produced Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rgm-86r-gmiii-e-f-s-f-mass-produced-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rgm-86r Gmiii E.f.s.f. Mass-produced Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rgm-89s Stark Jegan E.f.s.f. Anti-ship Assault Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rgm-89s-stark-jegan-e-f-s-f-anti-ship-assault-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rgm-89s Stark Jegan E.f.s.f. Anti-ship Assault Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rgm-96x Jesta E.f.s.f. Special Operations Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rgm-96x-jesta-e-f-s-f-special-operations-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rgm-96x Jesta E.f.s.f. Special Operations Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rms-106 Hi-zack (earth Federation Force)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rms-106-hi-zack-earth-federation-force-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rms-106 Hi-zack (earth Federation Force)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rms-119 Ewac Zack Blue Force''s Mobile Suit Reconnaissance Type', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rms-119-ewac-zack-blue-force-s-mobile-suit-reconnaissance-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rms-119 Ewac Zack Blue Force''s Mobile Suit Reconnaissance Type' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rodi', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rodi-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rodi' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-0 Unicorn Gundam (destroy Mode) Full Psycho-frame Prototype Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-0-unicorn-gundam-destroy-mode-full-psycho-frame-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-0 Unicorn Gundam (destroy Mode) Full Psycho-frame Prototype Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-0 Unicorn Gundam (unicorn Mode) Full Psycho-frame Prototype Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-0-unicorn-gundam-unicorn-mode-full-psycho-frame-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-0 Unicorn Gundam (unicorn Mode) Full Psycho-frame Prototype Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-0 Unicorn Gundam 03 Phenex (destroy Mode) (narrative VER.)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-0-unicorn-gundam-03-phenex-destroy-mode-narrative-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-0 Unicorn Gundam 03 Phenex (destroy Mode) (narrative VER.)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-0 Unicorn Gundam 3 Phenex (unicorn Mode) Narrative VER.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-0-unicorn-gundam-3-phenex-unicorn-mode-narrative-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-0 Unicorn Gundam 3 Phenex (unicorn Mode) Narrative VER.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-0000 Full Armor Unicorn Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-0000-full-armor-unicorn-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-0000 Full Armor Unicorn Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-105 XI Gundam Minovsky Flight System Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-105-xi-gundam-minovsky-flight-system-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-105 XI Gundam Minovsky Flight System Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-110 Garthley E.f.s.f. Prototype Transformable Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-110-garthley-e-f-s-f-prototype-transformable-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-110 Garthley E.f.s.f. Prototype Transformable Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-78-2 Gundam (beyond Global)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-78-2-gundam-beyond-global-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-78-2 Gundam (beyond Global)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-78-2 Gundam (ecopla 1/144 Workshop Kit VER.)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-78-2-gundam-ecopla-1-144-workshop-kit-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-78-2 Gundam (ecopla 1/144 Workshop Kit VER.)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-78-2 Gundam E.f.s.f. Prototype Close-combat Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-78-2-gundam-e-f-s-f-prototype-close-combat-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-78-2 Gundam E.f.s.f. Prototype Close-combat Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-78gp02a Gundam Gp02a (e.f.s.f. Prototype Attack Use Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-78gp02a-gundam-gp02a-e-f-s-f-prototype-attack-use-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-78gp02a Gundam Gp02a (e.f.s.f. Prototype Attack Use Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-78gp03 Dendrobium', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-78gp03-dendrobium-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-78gp03 Dendrobium' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-78gp03 Gundam GP03 Dendrobium', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-78gp03-gundam-gp03-dendrobium-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-78gp03 Gundam GP03 Dendrobium' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-79(g) Gundam Ground Type E.f.s.f. First Production Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-79g-gundam-ground-type-e-f-s-f-first-production-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-79(g) Gundam Ground Type E.f.s.f. First Production Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-79(g) 陸戦型ガンダム 鉄山装', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-79g-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-79(g) 陸戦型ガンダム 鉄山装' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-79(g)s Gundam Ground Type-s Gundam Thunderbolt VER.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-79gs-gundam-ground-type-s-gundam-thunderbolt-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-79(g)s Gundam Ground Type-s Gundam Thunderbolt VER.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-93 Ν Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-93-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-93 Ν Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-93-ν2 Hi-ν Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-rx-93-2-hi-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-93-ν2 Hi-ν Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Saviour Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-saviour-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Saviour Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Schwalbe Graze (macdillis)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-schwalbe-graze-macdillis-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Schwalbe Graze (macdillis)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Scramble Gundam (yasima Shigure Custom Made Machinegun)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-scramble-gundam-yasima-shigure-custom-made-machinegun-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Scramble Gundam (yasima Shigure Custom Made Machinegun)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Sengoku Astray Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-sengoku-astray-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Sengoku Astray Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Servee Gundam Scheherazade', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-servee-gundam-scheherazade-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Servee Gundam Scheherazade' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Shin Burning Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-shin-burning-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Shin Burning Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Sky High Wings Build Divers Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-sky-high-wings-build-divers-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Sky High Wings Build Divers Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Slash Zaku Phantom (yzak Joule Dedicated Machine)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-slash-zaku-phantom-yzak-joule-dedicated-machine-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Slash Zaku Phantom (yzak Joule Dedicated Machine)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Space Backpack For Gundam G-self', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-space-backpack-for-gundam-g-self-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Space Backpack For Gundam G-self' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Space Jahannam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-space-jahannam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Space Jahannam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Space Jahannam Klim Nick Use', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-space-jahannam-klim-nick-use-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Space Jahannam Klim Nick Use' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Spinning Blaster', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-spinning-blaster-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Spinning Blaster' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Strike Dagger', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-strike-dagger-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Strike Dagger' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Strike Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-strike-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Strike Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Strike Freedom Gundam (lightning Edition)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-strike-freedom-gundam-lightning-edition-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Strike Freedom Gundam (lightning Edition)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Strike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-strike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Strike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Strike Gundam Gat-x105', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-strike-gundam-gat-x105-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Strike Gundam Gat-x105' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Strike Gundam Striker Weapon System', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-strike-gundam-striker-weapon-system-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Strike Gundam Striker Weapon System' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Strike Rouge + I.w.s.p.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-strike-rouge-i-w-s-p-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Strike Rouge + I.w.s.p.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Super Fumina Axe Angel W', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-super-fumina-axe-angel-w-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Super Fumina Axe Angel W' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Super Fumina Minato Sakai''s Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-super-fumina-minato-sakai-s-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Super Fumina Minato Sakai''s Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Sword Impulse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-sword-impulse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Sword Impulse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Swordstrike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-swordstrike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Swordstrike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'The Northern Pod (build Fighters Support Unit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-the-northern-pod-build-fighters-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='The Northern Pod (build Fighters Support Unit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'The Witch From Mercury Weapon Display Base', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-the-witch-from-mercury-weapon-display-base-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='The Witch From Mercury Weapon Display Base' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Tiltrotor Pack Build Divers Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-tiltrotor-pack-build-divers-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Tiltrotor Pack Build Divers Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Transient Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-transient-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Transient Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Transient Gundam Glacier', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-transient-gundam-glacier-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Transient Gundam Glacier' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Try-burning Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-try-burning-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Try-burning Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Universe Booster Plansky Power Gate Star Build Strike Gundam Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-universe-booster-plansky-power-gate-star-build-strike-gundam-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Universe Booster Plansky Power Gate Star Build Strike Gundam Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Wing Gundam \"ver.ka\" (xxxg-01w)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-wing-gundam-ver-ka-xxxg-01w-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Wing Gundam \"ver.ka\" (xxxg-01w)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Wing Gundam Fenice', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-wing-gundam-fenice-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Wing Gundam Fenice' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Xxxg-01d Gundam Deathscythe', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-xxxg-01d-gundam-deathscythe-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Xxxg-01d Gundam Deathscythe' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Xxxg-01s Shenlong Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-xxxg-01s-shenlong-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Xxxg-01s Shenlong Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zaku Amazing Build Fighter Tatsuya Yuuki Custom Made Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zaku-amazing-build-fighter-tatsuya-yuuki-custom-made-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zaku Amazing Build Fighter Tatsuya Yuuki Custom Made Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zaku Warrior', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zaku-warrior-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zaku Warrior' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zaku Warrior (live Concert Version)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zaku-warrior-live-concert-version-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zaku Warrior (live Concert Version)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zedas [xyv-xcl]', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zedas-xyv-xcl-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zedas [xyv-xcl]' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zeta Gundam \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zeta-gundam-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zeta Gundam \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-1000 Zaku Warrior +blaze Wizard & Gunner Wizard', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zgmf-1000-zaku-warrior-blaze-wizard-gunner-wizard-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-1000 Zaku Warrior +blaze Wizard & Gunner Wizard' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x13a Providence Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zgmf-x13a-providence-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x13a Providence Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x19a ∞justice Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zgmf-x19a-justice-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x19a ∞justice Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x56s/α Force Impulse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zgmf-x56s-force-impulse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x56s/α Force Impulse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x56s/β Sword Impulse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-zgmf-x56s-sword-impulse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x56s/β Sword Impulse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'イオフレーム獅電', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-unknown-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='イオフレーム獅電' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', '流星号(グレイズ改式)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-unknown-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='流星号(グレイズ改式)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', '漲影 (shoei)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/hg-144-shoei-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='漲影 (shoei)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', '00 Raiser (celestial Being Mobile Suit Gn-0000+gn-0000)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-00-raiser-celestial-being-mobile-suit-gn-0000-gn-0000-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='00 Raiser (celestial Being Mobile Suit Gn-0000+gn-0000)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Aile Strike Gundam (gat-x105 Omni Enforcer Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-aile-strike-gundam-gat-x105-omni-enforcer-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Aile Strike Gundam (gat-x105 Omni Enforcer Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Build Strike Gundam Full Package', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-build-strike-gundam-full-package-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Build Strike Gundam Full Package' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Crossbone Gundam X1', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-crossbone-gundam-x1-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Crossbone Gundam X1' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Destiny Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-destiny-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Destiny Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Force Impulse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-force-impulse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Force Impulse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Full Armor Unicorn Gundam (full Psycho-frame Prototype Rx-0)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-full-armor-unicorn-gundam-full-psycho-frame-prototype-rx-0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Full Armor Unicorn Gundam (full Psycho-frame Prototype Rx-0)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Fx-550 Skygrasper (launcher Pack)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-fx-550-skygrasper-launcher-pack-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Fx-550 Skygrasper (launcher Pack)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'God Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-god-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='God Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Gundam Astray Gold Frame Amatsu Mina', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-gundam-astray-gold-frame-amatsu-mina-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Gundam Astray Gold Frame Amatsu Mina' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Gundam Astray Red Frame (real Grade 1/144 Scale)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-gundam-astray-red-frame-real-grade-1-144-scale-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Gundam Astray Red Frame (real Grade 1/144 Scale)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Gundam Epyon Mobile Suit Gundam Wing Oz-13ms', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-gundam-epyon-mobile-suit-gundam-wing-oz-13ms-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Gundam Epyon Mobile Suit Gundam Wing Oz-13ms' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Gundam Exia (celestial Being Mobile Suit Gn-001)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-gundam-exia-celestial-being-mobile-suit-gn-001-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Gundam Exia (celestial Being Mobile Suit Gn-001)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Gundam GP01 Zephyranthes', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-gundam-gp01-zephyranthes-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Gundam GP01 Zephyranthes' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Gundam Gp01fb Full Burnern', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-gundam-gp01fb-full-burnern-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Gundam Gp01fb Full Burnern' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Gundam Mk-ii A.e.u.g.', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-gundam-mk-ii-a-e-u-g-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Gundam Mk-ii A.e.u.g.' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Gundam Mk-ii Titans (gundam Mk-ii Titans Suit Rx-028)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-gundam-mk-ii-titans-gundam-mk-ii-titans-suit-rx-028-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Gundam Mk-ii Titans (gundam Mk-ii Titans Suit Rx-028)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Justice Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-justice-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Justice Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Ms-06f Zaku II (principality Of Zeon Mass Productive Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-ms-06f-zaku-ii-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Ms-06f Zaku II (principality Of Zeon Mass Productive Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Ms-06r-2 Johnny Ridden''s Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-ms-06r-2-johnny-ridden-s-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Ms-06r-2 Johnny Ridden''s Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Ms-06s Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-ms-06s-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Ms-06s Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Msm-07s Gouf (principal Zeon Char Aznable Use Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-msm-07s-gouf-principal-zeon-char-aznable-use-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Msm-07s Gouf (principal Zeon Char Aznable Use Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Msn-02 Zeong Principal Of Zeon Mobile Suit For New Type', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-msn-02-zeong-principal-of-zeon-mobile-suit-for-new-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Msn-02 Zeong Principal Of Zeon Mobile Suit For New Type' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Msn-04 Sazabi', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-msn-04-sazabi-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Msn-04 Sazabi' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Neo Zeon Mobile Suit Customized For Newtype Msn-06s Sinanju', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-neo-zeon-mobile-suit-customized-for-newtype-msn-06s-sinanju-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Neo Zeon Mobile Suit Customized For Newtype Msn-06s Sinanju' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Rx-78-02 Gundam (gundam The Origin)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-rx-78-02-gundam-gundam-the-origin-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Rx-78-02 Gundam (gundam The Origin)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Rx-78-2 Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-rx-78-2-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Rx-78-2 Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Rx-93 V Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-rx-93-v-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Rx-93 V Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Rx-93-ν2 Hi-ν Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-rx-93-2-hi-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Rx-93-ν2 Hi-ν Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Strike Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-strike-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Strike Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Tallgeese EW Mobile Suit Gundam Wing Endless Waltz Oz-00ms RG 1/144 Tallgeese EW', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-tallgeese-ew-mobile-suit-gundam-wing-endless-waltz-oz-00ms-rg-1-144-tallgeese-ew-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Tallgeese EW Mobile Suit Gundam Wing Endless Waltz Oz-00ms RG 1/144 Tallgeese EW' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Unicorn Gundam (full Psycho-frame Prototype Mobile Suit Rx-0)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-unicorn-gundam-full-psycho-frame-prototype-mobile-suit-rx-0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Unicorn Gundam (full Psycho-frame Prototype Mobile Suit Rx-0)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Unicorn Gundam 02 Banshee Norn (full Psycho Frame Prototype Suit Rx-0[n])', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-unicorn-gundam-02-banshee-norn-full-psycho-frame-prototype-suit-rx-0-n-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Unicorn Gundam 02 Banshee Norn (full Psycho Frame Prototype Suit Rx-0[n])' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Wing Gundam (xxxg-01w)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-wing-gundam-xxxg-01w-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Wing Gundam (xxxg-01w)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Wing Gundam EW', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-wing-gundam-ew-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Wing Gundam EW' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Wing Gundam Zero EW', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-wing-gundam-zero-ew-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Wing Gundam Zero EW' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('RG', '1/144', 'Zeta Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/rg-144-zeta-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='RG' AND scale='1/144' AND name='Zeta Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', '00 Gundam Seven Sword/g', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-00-gundam-seven-sword-g-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='00 Gundam Seven Sword/g' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', '00 Qantt Full Saber (celestial Being Mobile Suit Gnt-0000/fs)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-00-qantt-full-saber-celestial-being-mobile-suit-gnt-0000-fs-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='00 Qantt Full Saber (celestial Being Mobile Suit Gnt-0000/fs)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', '00 Raiser (celestial Being Mobile Suit Gn-0000+gnr-010)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-00-raiser-celestial-being-mobile-suit-gn-0000-gnr-010-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='00 Raiser (celestial Being Mobile Suit Gn-0000+gnr-010)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Aile Strike Gundam (o.m.n.i. Enforcer Mobile Suit Gat-x105)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-aile-strike-gundam-o-m-n-i-enforcer-mobile-suit-gat-x105-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Aile Strike Gundam (o.m.n.i. Enforcer Mobile Suit Gat-x105)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ams-119 Geara Doga (neo Zeon Mass-produced Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ams-119-geara-doga-neo-zeon-mass-produced-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ams-119 Geara Doga (neo Zeon Mass-produced Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Amx-004-2 Qubeley Mk-ii (neo Zeon Prototype Mobile Suit For Newtype)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-amx-004-2-qubeley-mk-ii-neo-zeon-prototype-mobile-suit-for-newtype-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Amx-004-2 Qubeley Mk-ii (neo Zeon Prototype Mobile Suit For Newtype)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Amx-004-3 Qubeley Mk-ii (neo Zeon Prototype Mobile Suit For Newtype)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-amx-004-3-qubeley-mk-ii-neo-zeon-prototype-mobile-suit-for-newtype-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Amx-004-3 Qubeley Mk-ii (neo Zeon Prototype Mobile Suit For Newtype)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Asw-g-08 Gundam Barbatos', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-asw-g-08-gundam-barbatos-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Asw-g-08 Gundam Barbatos' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Asw-g-08 Gundam Barbatos Lupus', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-asw-g-08-gundam-barbatos-lupus-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Asw-g-08 Gundam Barbatos Lupus' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Asw-g-xx Gundam Vidar', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-asw-g-xx-gundam-vidar-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Asw-g-xx Gundam Vidar' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Build Gundam Mk-ii Rx-178b', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-build-gundam-mk-ii-rx-178b-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Build Gundam Mk-ii Rx-178b' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Build Strike Gundam Full Package (gat-x105b/fp)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-build-strike-gundam-full-package-gat-x105b-fp-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Build Strike Gundam Full Package (gat-x105b/fp)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Celestial Being Mobile Suit Gnt-0000 00 Qant', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-celestial-being-mobile-suit-gnt-0000-00-qant-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Celestial Being Mobile Suit Gnt-0000 00 Qant' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Concept-x 6-1-2 Turn X', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-concept-x-6-1-2-turn-x-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Concept-x 6-1-2 Turn X' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Cross Bone Gundam X1 \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-cross-bone-gundam-x1-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Cross Bone Gundam X1 \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ex-s Gundam (e.f.s.f. Prototype Transformable Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ex-s-gundam-e-f-s-f-prototype-transformable-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ex-s Gundam (e.f.s.f. Prototype Transformable Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ex-s Gundam / S Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ex-s-gundam-s-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ex-s Gundam / S Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'F.a. Test MS Fa-010-a Fazz \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-f-a-test-ms-fa-010-a-fazz-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='F.a. Test MS Fa-010-a Fazz \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'F91 Gundam F91 (e.f.s.f. Prototype Attack Use Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-f91-gundam-f91-e-f-s-f-prototype-attack-use-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='F91 Gundam F91 (e.f.s.f. Prototype Attack Use Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Fa-010-a Fazz (e.f.s.f. Prototype Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-fa-010-a-fazz-e-f-s-f-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Fa-010-a Fazz (e.f.s.f. Prototype Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Freedom Gundam Z.a.f.t. Mobile Suit Zgmf-x10a', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-freedom-gundam-z-a-f-t-mobile-suit-zgmf-x10a-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Freedom Gundam Z.a.f.t. Mobile Suit Zgmf-x10a' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gat-x102 Duel Gundam Assault Shroud', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gat-x102-duel-gundam-assault-shroud-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gat-x102 Duel Gundam Assault Shroud' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gat-x103 Buster Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gat-x103-buster-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gat-x103 Buster Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gat-x105 Strike Gundam Ver.rm', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gat-x105-strike-gundam-ver-rm-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gat-x105 Strike Gundam Ver.rm' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gat-x207 Blitz Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gat-x207-blitz-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gat-x207 Blitz Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gat-x303 Aegis Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gat-x303-aegis-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gat-x303 Aegis Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gnx-603t Gn-x Esf Gn Drive[t]-equipped Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gnx-603t-gn-x-esf-gn-drive-t-equipped-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gnx-603t Gn-x Esf Gn Drive[t]-equipped Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Age-1 Normal', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-age-1-normal-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Age-1 Normal' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Age-1 Spallow', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-age-1-spallow-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Age-1 Spallow' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Age-1 Titus', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-age-1-titus-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Age-1 Titus' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Age-2 Dark Hound', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-age-2-dark-hound-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Age-2 Dark Hound' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Age-2 Double Bullet', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-age-2-double-bullet-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Age-2 Double Bullet' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Age-2 Normal', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-age-2-normal-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Age-2 Normal' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Ageii Magnum (ryoya Kujos Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-ageii-magnum-ryoya-kujos-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Ageii Magnum (ryoya Kujos Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Amazing Red Warrior Pf-78-3a', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-amazing-red-warrior-pf-78-3a-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Amazing Red Warrior Pf-78-3a' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Astray Blue Frame D (gai Murakumo''s Custom Mobile Suit Mbf-p03d)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-astray-blue-frame-d-gai-murakumo-s-custom-mobile-suit-mbf-p03d-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Astray Blue Frame D (gai Murakumo''s Custom Mobile Suit Mbf-p03d)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Dynames (celestial Being Mobile Suit Gn-002)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-dynames-celestial-being-mobile-suit-gn-002-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Dynames (celestial Being Mobile Suit Gn-002)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Epyon Mobile Suit Oz-13ms', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-epyon-mobile-suit-oz-13ms-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Epyon Mobile Suit Oz-13ms' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Exia (celestial Being Mobile Suit Gn-001)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-exia-celestial-being-mobile-suit-gn-001-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Exia (celestial Being Mobile Suit Gn-001)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Exia Dark Matter Ppgn-001', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-exia-dark-matter-ppgn-001-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Exia Dark Matter Ppgn-001' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Fenice Rinascita Xxxg-01wfr', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-fenice-rinascita-xxxg-01wfr-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Fenice Rinascita Xxxg-01wfr' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Gp03s (e.f.s.f. Attack Use Prototype Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-gp03s-e-f-s-f-attack-use-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Gp03s (e.f.s.f. Attack Use Prototype Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Kyrios (celestial Being Mobile Suit Gn-003)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-kyrios-celestial-being-mobile-suit-gn-003-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Kyrios (celestial Being Mobile Suit Gn-003)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Rx-78 Gp02a (u.n.t. Spacy Prototype Tactical Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-rx-78-gp02a-u-n-t-spacy-prototype-tactical-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Rx-78 Gp02a (u.n.t. Spacy Prototype Tactical Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Rx-78/c.a', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-rx-78-c-a-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Rx-78/c.a' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Spiegel Neo Germany Mobile Fighter Gf13-021ng', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-spiegel-neo-germany-mobile-fighter-gf13-021ng-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Spiegel Neo Germany Mobile Fighter Gf13-021ng' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gundam Virtue (celestial Being Mobile Suit Gn-005)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gundam-virtue-celestial-being-mobile-suit-gn-005-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gundam Virtue (celestial Being Mobile Suit Gn-005)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gx-9900 Gundam X (satellite System Loading Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gx-9900-gundam-x-satellite-system-loading-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gx-9900 Gundam X (satellite System Loading Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Gx-9901-dx Gundam Double X (satellite System Loading Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-gx-9901-dx-gundam-double-x-satellite-system-loading-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Gx-9901-dx Gundam Double X (satellite System Loading Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Master Gundam Neo Hong Kong Mobile Fighter Gf13-001nhii', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-master-gundam-neo-hong-kong-mobile-fighter-gf13-001nhii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Master Gundam Neo Hong Kong Mobile Fighter Gf13-001nhii' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Fighter G Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-fighter-g-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Fighter G Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Amx-004 Qubeley (axis Prototype Mobile Suit For Newtype)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-amx-004-qubeley-axis-prototype-mobile-suit-for-newtype-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Amx-004 Qubeley (axis Prototype Mobile Suit For Newtype)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Fa-78 Full Armor Gundam [gundam Thunderbolt] \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-fa-78-full-armor-gundam-gundam-thunderbolt-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Fa-78 Full Armor Gundam [gundam Thunderbolt] \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Lm314v21 Victory Two Gundam \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-lm314v21-victory-two-gundam-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Lm314v21 Victory Two Gundam \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Msm-07 Z''gok', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-msm-07-z-gok-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Msm-07 Z''gok' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Msn-06s Sinanju Stein \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-msn-06s-sinanju-stein-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Msn-06s Sinanju Stein \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Rgm-79(g) (e.f.s.f. First Production Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-rgm-79g-e-f-s-f-first-production-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Rgm-79(g) (e.f.s.f. First Production Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Rx-78-2 Gundam Ver.ka', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-rx-78-2-gundam-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Rx-78-2 Gundam Ver.ka' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Rx-78-3 Gundam (u.n.t.spacy Prototype Close-combat Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-rx-78-3-gundam-u-n-t-spacy-prototype-close-combat-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Rx-78-3 Gundam (u.n.t.spacy Prototype Close-combat Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mobile Suit Rx-93 Ν Gundam Ver.ka', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mobile-suit-rx-93-gundam-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mobile Suit Rx-93 Ν Gundam Ver.ka' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-05b Zaku I (principality Of Zeon Mass Productive Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-05b-zaku-i-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-05b Zaku I (principality Of Zeon Mass Productive Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06f Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06f-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06f Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06f Zaku Minelayer', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06f-zaku-minelayer-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06f Zaku Minelayer' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06f-2 Zaku II F2 (principality Of Zeon Mass Productive Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06f-2-zaku-ii-f2-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06f-2 Zaku II F2 (principality Of Zeon Mass Productive Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06f-2 Zakuii F2 (e.f.s.f. Mass Productive Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06f-2-zakuii-f2-e-f-s-f-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06f-2 Zakuii F2 (e.f.s.f. Mass Productive Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06j Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06j-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06j Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06k Zakucannon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06k-zakucannon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06k Zakucannon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06r Zaku II High Mobility Type \"psycho Zaku\" [gundam Thunderbolt] Ver.ka', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06r-zaku-ii-high-mobility-type-psycho-zaku-gundam-thunderbolt-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06r Zaku II High Mobility Type \"psycho Zaku\" [gundam Thunderbolt] Ver.ka' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06r-1 Zaku II (zeon Duedom Samsinaga''s Customize White Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06r-1-zaku-ii-zeon-duedom-samsinaga-s-customize-white-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06r-1 Zaku II (zeon Duedom Samsinaga''s Customize White Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06r-1a Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06r-1a-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06r-1a Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06r-1a Zaku II (principality Of Zeon Mass Productive Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06r-1a-zaku-ii-principality-of-zeon-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06r-1a Zaku II (principality Of Zeon Mass Productive Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06r-2 Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06r-2-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06r-2 Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06r-2 Zaku II (zeon Dukedom J.ridden''s Customize Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06r-2-zaku-ii-zeon-dukedom-j-ridden-s-customize-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06r-2 Zaku II (zeon Dukedom J.ridden''s Customize Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-06s Zaku II (char Aznable''s Customize Ver.2.0)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-06s-zaku-ii-char-aznable-s-customize-ver-2-0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-06s Zaku II (char Aznable''s Customize Ver.2.0)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-07b Gouf (principality Of Zeon Mass Productive Land Battle Type Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-07b-gouf-principality-of-zeon-mass-productive-land-battle-type-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-07b Gouf (principality Of Zeon Mass Productive Land Battle Type Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-07b Gouf Ver.2.0', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-07b-gouf-ver-2-0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-07b Gouf Ver.2.0' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-09 Dom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-09-dom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-09 Dom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-09r Rick Dom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-09r-rick-dom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-09r Rick Dom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-09rs Rick-dom (principality Of Zeon Char''s Customize Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-09rs-rick-dom-principality-of-zeon-char-s-customize-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-09rs Rick-dom (principality Of Zeon Char''s Customize Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-14a Gelgoog (principality Of Zeon Anavel Gato''s Customize Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-14a-gelgoog-principality-of-zeon-anavel-gato-s-customize-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-14a Gelgoog (principality Of Zeon Anavel Gato''s Customize Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-14a Gelgoog Ver.2.0', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-14a-gelgoog-ver-2-0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-14a Gelgoog Ver.2.0' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-14b/c Gelgoog Cannon', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-14b-c-gelgoog-cannon-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-14b/c Gelgoog Cannon' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-14s Gelgoog', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-14s-gelgoog-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-14s Gelgoog' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Ms-14s Gelgoog (principality Of Zeon Char Aznable''s Customize Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-ms-14s-gelgoog-principality-of-zeon-char-aznable-s-customize-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Ms-14s Gelgoog (principality Of Zeon Char Aznable''s Customize Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msa-0011 S-gundam (e.f.s.f. Prototype Transformable Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msa-0011-s-gundam-e-f-s-f-prototype-transformable-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msa-0011 S-gundam (e.f.s.f. Prototype Transformable Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msm-03 Gogg', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msm-03-gogg-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msm-03 Gogg' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msm-04 Acguay (principality Of Zeon Mass-productive Amphibious Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msm-04-acguay-principality-of-zeon-mass-productive-amphibious-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msm-04 Acguay (principality Of Zeon Mass-productive Amphibious Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msm-07s Z''gok (principality Of Zeon Char''s Custom Type Amphibious Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msm-07s-z-gok-principality-of-zeon-char-s-custom-type-amphibious-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msm-07s Z''gok (principality Of Zeon Char''s Custom Type Amphibious Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msn-00100 Hyaku-shiki', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msn-00100-hyaku-shiki-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msn-00100 Hyaku-shiki' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msn-00100 Hyaku-shiki (a.e.u.g. Attack Use Prototype Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msn-00100-hyaku-shiki-a-e-u-g-attack-use-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msn-00100 Hyaku-shiki (a.e.u.g. Attack Use Prototype Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msn-001a1 Delta Plus (e.f.s.f. Transformable Mobile Suit Prototype)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msn-001a1-delta-plus-e-f-s-f-transformable-mobile-suit-prototype-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msn-001a1 Delta Plus (e.f.s.f. Transformable Mobile Suit Prototype)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msn-02 Perfect Zeong (principality Of Zeon Mobile Suit For Newtype)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msn-02-perfect-zeong-principality-of-zeon-mobile-suit-for-newtype-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msn-02 Perfect Zeong (principality Of Zeon Mobile Suit For Newtype)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msn-02 Zeong (principality Of Zeon Mobile Suit For Newtype)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msn-02-zeong-principality-of-zeon-mobile-suit-for-newtype-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msn-02 Zeong (principality Of Zeon Mobile Suit For Newtype)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msn-04 Sazabi (neo Zeon Char Aznable''s Customize Mobile Suit For New Type)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msn-04-sazabi-neo-zeon-char-aznable-s-customize-mobile-suit-for-new-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msn-04 Sazabi (neo Zeon Char Aznable''s Customize Mobile Suit For New Type)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msn-06s Sinanju', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msn-06s-sinanju-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msn-06s Sinanju' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msn-06s-2 Sinanju Stein (narrative VER.)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msn-06s-2-sinanju-stein-narrative-ver-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msn-06s-2 Sinanju Stein (narrative VER.)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msz-006a1 Zeta Plus (karaba Production Type Transformable Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msz-006a1-zeta-plus-karaba-production-type-transformable-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msz-006a1 Zeta Plus (karaba Production Type Transformable Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Msz-006c1 Zeta Plus C1', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-msz-006c1-zeta-plus-c1-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Msz-006c1 Zeta Plus C1' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Mvf-x08 Eclipse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-mvf-x08-eclipse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Mvf-x08 Eclipse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Oz-00ms Tallgeese (gundam W Endless Waltz)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-oz-00ms-tallgeese-gundam-w-endless-waltz-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Oz-00ms Tallgeese (gundam W Endless Waltz)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Plan303e Deep Striker', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-plan303e-deep-striker-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Plan303e Deep Striker' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Providence Gundam (z.a.f.t. Mobile Suit Zgmf-x13a)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-providence-gundam-z-a-f-t-mobile-suit-zgmf-x13a-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Providence Gundam (z.a.f.t. Mobile Suit Zgmf-x13a)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rb-79 Middle-range Support Type Mobile Pod Ball Ver.ka', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rb-79-middle-range-support-type-mobile-pod-ball-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rb-79 Middle-range Support Type Mobile Pod Ball Ver.ka' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rb-79k Ball', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rb-79k-ball-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rb-79k Ball' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-79 Gm', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-79-gm-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-79 Gm' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-79(g) Gm Sniper (e.e.g.f. First Production Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-79g-gm-sniper-e-e-g-f-first-production-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-79(g) Gm Sniper (e.e.g.f. First Production Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-79c Gm Type C (e.f.s.f. First Production Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-79c-gm-type-c-e-f-s-f-first-production-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-79c Gm Type C (e.f.s.f. First Production Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-79c Gm Type C (e.f.s.f. Mass Productive Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-79c-gm-type-c-e-f-s-f-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-79c Gm Type C (e.f.s.f. Mass Productive Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-79g Gm Command (colony Type)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-79g-gm-command-colony-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-79g Gm Command (colony Type)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-79sc Gm Sniper Custom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-79sc-gm-sniper-custom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-79sc Gm Sniper Custom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-79sp Gm Sniper II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-79sp-gm-sniper-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-79sp Gm Sniper II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-89 Jegan', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-89-jegan-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-89 Jegan' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgm-96x Jesta', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgm-96x-jesta-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgm-96x Jesta' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgz-91 Re-gz (e.f.s.f. Attack Use Variable Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgz-91-re-gz-e-f-s-f-attack-use-variable-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgz-91 Re-gz (e.f.s.f. Attack Use Variable Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rgz-95c Rezel Type-c (defenser A+b-unit)(gr)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rgz-95c-rezel-type-c-defenser-a-b-unitgr-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rgz-95c Rezel Type-c (defenser A+b-unit)(gr)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rms-099 Rick Dias (a.e.u.g. Quattro Vageena''s Customize Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rms-099-rick-dias-a-e-u-g-quattro-vageena-s-customize-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rms-099 Rick Dias (a.e.u.g. Quattro Vageena''s Customize Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rms-106 Hi-zack Titans Mass Productive Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rms-106-hi-zack-titans-mass-productive-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rms-106 Hi-zack Titans Mass Productive Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rms-108 Marasai', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rms-108-marasai-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rms-108 Marasai' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-0 Full Armor Unicorn Gundam \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-0-full-armor-unicorn-gundam-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-0 Full Armor Unicorn Gundam \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-0 Unicorn Gundam 02 Banshee', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-0-unicorn-gundam-02-banshee-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-0 Unicorn Gundam 02 Banshee' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-0 Unicorn Gundam 03 Phenex', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-0-unicorn-gundam-03-phenex-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-0 Unicorn Gundam 03 Phenex' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-178 Gundam Mk-ii A.e.u.g. Prototype Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-178-gundam-mk-ii-a-e-u-g-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-178 Gundam Mk-ii A.e.u.g. Prototype Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-178 Gundam Mk-ii Ver.2.0 Titans Prototype Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-178-gundam-mk-ii-ver-2-0-titans-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-178 Gundam Mk-ii Ver.2.0 Titans Prototype Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-77-2 Gungannon (e.f.s.f Prototype Middle-range Support Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-77-2-gungannon-e-f-s-f-prototype-middle-range-support-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-77-2 Gungannon (e.f.s.f Prototype Middle-range Support Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-78 Gundam GP01 (u.n.t. Space Prototype Multipurpose Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-78-gundam-gp01-u-n-t-space-prototype-multipurpose-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-78 Gundam GP01 (u.n.t. Space Prototype Multipurpose Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-78-2 Gundam (e.f.s.f. Prototype Close-combat Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-78-2-gundam-e-f-s-f-prototype-close-combat-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-78-2 Gundam (e.f.s.f. Prototype Close-combat Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-78-4 Gundam Go4 (e.f.s.f. Prototype Mobile Suit Of Space Battle Use)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-78-4-gundam-go4-e-f-s-f-prototype-mobile-suit-of-space-battle-use-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-78-4 Gundam Go4 (e.f.s.f. Prototype Mobile Suit Of Space Battle Use)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-78-5 Gundam G05 (e.f.s.f. Prototype Mobile Suit Of Space Battle Use)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-78-5-gundam-g05-e-f-s-f-prototype-mobile-suit-of-space-battle-use-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-78-5 Gundam G05 (e.f.s.f. Prototype Mobile Suit Of Space Battle Use)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-78nt-1 Gundam Nt-1 (e.f.s.f. Prototype Mobile Suit For Newtype)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-78nt-1-gundam-nt-1-e-f-s-f-prototype-mobile-suit-for-newtype-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-78nt-1 Gundam Nt-1 (e.f.s.f. Prototype Mobile Suit For Newtype)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Rx-93 Ν Gundam (e.f.s.f. Amuro Ray''s Customize Mobile Suit For New Type)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-rx-93-gundam-e-f-s-f-amuro-ray-s-customize-mobile-suit-for-new-type-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Rx-93 Ν Gundam (e.f.s.f. Amuro Ray''s Customize Mobile Suit For New Type)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Sengoku Astray Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-sengoku-astray-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Sengoku Astray Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Shining Gundam (neo Japan Mobile Fighter)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-shining-gundam-neo-japan-mobile-fighter-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Shining Gundam (neo Japan Mobile Fighter)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Strike Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-strike-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Strike Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Strike Rouge (orb Mobile Suit Mbf-02)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-strike-rouge-orb-mobile-suit-mbf-02-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Strike Rouge (orb Mobile Suit Mbf-02)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Universe Booster Ub-01 Star Build Strike Gundam Support Unit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-universe-booster-ub-01-star-build-strike-gundam-support-unit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Universe Booster Ub-01 Star Build Strike Gundam Support Unit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Wing Gundam Proto Zero Mobile Suit Xxxg-00w0', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-wing-gundam-proto-zero-mobile-suit-xxxg-00w0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Wing Gundam Proto Zero Mobile Suit Xxxg-00w0' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Wing Gundam Xxxg-01w', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-wing-gundam-xxxg-01w-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Wing Gundam Xxxg-01w' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Wing Gundam Zero', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-wing-gundam-zero-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Wing Gundam Zero' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Xxxg-01h Gundam Heavyarms', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-xxxg-01h-gundam-heavyarms-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Xxxg-01h Gundam Heavyarms' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Xxxg-01sr Gundam Sandrock', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-xxxg-01sr-gundam-sandrock-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Xxxg-01sr Gundam Sandrock' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Z.a.f.t. Mobile Suit Zgmf-x09a Justice Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-z-a-f-t-mobile-suit-zgmf-x09a-justice-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Z.a.f.t. Mobile Suit Zgmf-x09a Justice Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Z.a.f.t. Mobile Suit Zgmf-x10a Freedom Gundam Ver.2.0', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-z-a-f-t-mobile-suit-zgmf-x10a-freedom-gundam-ver-2-0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Z.a.f.t. Mobile Suit Zgmf-x10a Freedom Gundam Ver.2.0' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Zgmf-1000/a1 Gunner Zaku Warrior (lunamaria Hawke Custom)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-zgmf-1000-a1-gunner-zaku-warrior-lunamaria-hawke-custom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Zgmf-1000/a1 Gunner Zaku Warrior (lunamaria Hawke Custom)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Zgmf-1017 Mobile Ginn', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-zgmf-1017-mobile-ginn-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Zgmf-1017 Mobile Ginn' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'MGSD Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-zgmf-x10a-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='MGSD Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('MG', '1/100', 'Zgmf-x42s Destiny Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/mg-100-zgmf-x42s-destiny-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='MG' AND scale='1/100' AND name='Zgmf-x42s Destiny Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', '00 Raiser (double Orizer)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-00-raiser-double-orizer-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='00 Raiser (double Orizer)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Fx-550 Skygrasper + Aqm/e-x01 Aile Striker', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-fx-550-skygrasper-aqm-e-x01-aile-striker-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Fx-550 Skygrasper + Aqm/e-x01 Aile Striker' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Gat-x105 Strike Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-gat-x105-strike-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Gat-x105 Strike Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Gat-x105+aqm/e-ym1 Perfect Strike Gundam (o.m.n.i. Enforcer Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-gat-x105-aqm-e-ym1-perfect-strike-gundam-o-m-n-i-enforcer-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Gat-x105+aqm/e-ym1 Perfect Strike Gundam (o.m.n.i. Enforcer Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Gundam Exia (celestial Being Mobile Suit Gn-001)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-gundam-exia-celestial-being-mobile-suit-gn-001-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Gundam Exia (celestial Being Mobile Suit Gn-001)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Gundam Seven Sword/g', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-gundam-seven-sword-g-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Gundam Seven Sword/g' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Led Unit For Gundam Exia', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-led-unit-for-gundam-exia-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Led Unit For Gundam Exia' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Led Unit For PG Rx-0 Unicorn Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-led-unit-for-pg-rx-0-unicorn-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Led Unit For PG Rx-0 Unicorn Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Mbf-02 Strike Rouge', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-mbf-02-strike-rouge-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Mbf-02 Strike Rouge' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Mbf-p02 Gundam Astray [red Frame]', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-mbf-p02-gundam-astray-red-frame-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Mbf-p02 Gundam Astray [red Frame]' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Ms-06f Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-ms-06f-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Ms-06f Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Ms-06s Zaku II', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-ms-06s-zaku-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Ms-06s Zaku II' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Msz-006 Zeta Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-msz-006-zeta-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Msz-006 Zeta Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Rx-178 Gundam Mk-ii', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-rx-178-gundam-mk-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Rx-178 Gundam Mk-ii' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Rx-178 Gundam Mk.ii', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-rx-178-gundam-mk-ii-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Rx-178 Gundam Mk.ii' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Rx-78 GP01 Gundam Gp01/fb', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-rx-78-gp01-gundam-gp01-fb-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Rx-78 GP01 Gundam Gp01/fb' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Rx-78-2 Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-rx-78-2-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Rx-78-2 Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Rx-78-2 Gundam (e.f.s.f. Prototype Close-combat Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-rx-78-2-gundam-e-f-s-f-prototype-close-combat-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Rx-78-2 Gundam (e.f.s.f. Prototype Close-combat Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Rx-78-2 Gundam Ver.1.0', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-rx-78-2-gundam-ver-1-0-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Rx-78-2 Gundam Ver.1.0' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Unicorn Gundam (full Psycho-frame Prototype Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-unicorn-gundam-full-psycho-frame-prototype-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Unicorn Gundam (full Psycho-frame Prototype Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Unicorn Gundam 02 Banshee Norn', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-unicorn-gundam-02-banshee-norn-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Unicorn Gundam 02 Banshee Norn' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'W-gundam Zerocustom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-w-gundam-zerocustom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='W-gundam Zerocustom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('PG', '1/60', 'Zgmf-x20a Strike Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/pg-60-zgmf-x20a-strike-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='PG' AND scale='1/60' AND name='Zgmf-x20a Strike Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Asw-g-08 Gundam Barbatos', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-asw-g-08-gundam-barbatos-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Asw-g-08 Gundam Barbatos' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Duel Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-duel-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Duel Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Kurenai Mushatoro Red Warrior Amazing Lady Kawaguchi', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-kurenai-mushatoro-red-warrior-amazing-lady-kawaguchi-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Kurenai Mushatoro Red Warrior Amazing Lady Kawaguchi' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Nebula Blitz Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-nebula-blitz-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Nebula Blitz Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Rx-zeromaru Ryame''s Mobile Suit', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-rx-zeromaru-ryame-s-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Rx-zeromaru Ryame''s Mobile Suit' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Rx-zeromaru Shinkikessho', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-rx-zeromaru-shinkikessho-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Rx-zeromaru Shinkikessho' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'S.d.g Gundam (terao Daikagu)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-s-d-g-gundam-terao-daikagu-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='S.d.g Gundam (terao Daikagu)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Sd-ex Gundam Aerial', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-sd-ex-gundam-aerial-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Sd-ex Gundam Aerial' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Star Winning Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-star-winning-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Star Winning Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Winning Gundam (team Try Fighters Gundam Hoshino''s Mobile Suit)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-winning-gundam-team-try-fighters-gundam-hoshino-s-mobile-suit-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Winning Gundam (team Try Fighters Gundam Hoshino''s Mobile Suit)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Xvx-016 Gundam Aerial', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-xvx-016-gundam-aerial-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Xvx-016 Gundam Aerial' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('SD', '1/144', 'Zgmf-x10a Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/sd-unk-zgmf-x10a-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='SD' AND scale='1/144' AND name='Zgmf-x10a Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Action Base 4 Black', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-action-base-4-black-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Action Base 4 Black' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Action Base Black 5', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-action-base-black-5-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Action Base Black 5' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Blaze Zaku Phantom', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-blaze-zaku-phantom-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Blaze Zaku Phantom' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Force Impulse Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-force-impulse-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Force Impulse Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gbn-base Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-gbn-base-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gbn-base Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam 00 Sky', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-gundam-00-sky-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam 00 Sky' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Gundam Aerial', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-gundam-aerial-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Gundam Aerial' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Justice Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-justice-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Justice Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mbf-02+ew454f Strike Rouge + I.w.s.p. Oordori Equipped Ver.rm', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mbf-02-ew454f-strike-rouge-i-w-s-p-oordori-equipped-ver-rm-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mbf-02+ew454f Strike Rouge + I.w.s.p. Oordori Equipped Ver.rm' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mbf-p01-re2 Gundam Astray Gold Frame Amatsu', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mbf-p01-re2-gundam-astray-gold-frame-amatsu-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mbf-p01-re2 Gundam Astray Gold Frame Amatsu' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Ginn', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mobile-ginn-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Ginn' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Suit Msz-010 Zz Gundam \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mobile-suit-msz-010-zz-gundam-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Suit Msz-010 Zz Gundam \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Suit Rx-0 Unicorn Gundam 02 Banshee \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mobile-suit-rx-0-unicorn-gundam-02-banshee-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Suit Rx-0 Unicorn Gundam 02 Banshee \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Suit Rx-0 Unicorn Gundam Ver.ka', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mobile-suit-rx-0-unicorn-gundam-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Suit Rx-0 Unicorn Gundam Ver.ka' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Suit Rx-93-v2 Hi-v Gundam \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mobile-suit-rx-93-v2-hi-v-gundam-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Suit Rx-93-v2 Hi-v Gundam \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Suit Xxxg-00w0 Wing Gundam Zero EW \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mobile-suit-xxxg-00w0-wing-gundam-zero-ew-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Suit Xxxg-00w0 Wing Gundam Zero EW \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Mobile Suit Zgundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-mobile-suit-zgundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Mobile Suit Zgundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Neogeon Msn-04 Mobile Suit Sazabi \"ver.ka\"', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-neogeon-msn-04-mobile-suit-sazabi-ver-ka-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Neogeon Msn-04 Mobile Suit Sazabi \"ver.ka\"' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rms-099 Rick Dias', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-rms-099-rick-dias-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rms-099 Rick Dias' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rms-099b Schuzrum-dias', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-rms-099b-schuzrum-dias-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rms-099b Schuzrum-dias' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Rx-0 Unicorn Gundam 02 Banshee (unicorn Mode)', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-rx-0-unicorn-gundam-02-banshee-unicorn-mode-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Rx-0 Unicorn Gundam 02 Banshee (unicorn Mode)' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x20a Strike Freedom Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-zgmf-x20a-strike-freedom-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x20a Strike Freedom Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x23s Saviour Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-zgmf-x23s-saviour-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x23s Saviour Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x24s Chaos Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-zgmf-x24s-chaos-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x24s Chaos Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x42s Destiny Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-zgmf-x42s-destiny-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x42s Destiny Gundam' LIMIT 1;

INSERT INTO kits (grade, scale, name, series, image_url, created_at) VALUES ('HG', '1/144', 'Zgmf-x666s Legend Gundam', '', '', 1772023451) ON CONFLICT(grade, scale, name) DO NOTHING;
INSERT INTO manuals (kit_id, name, url, lang, pages, size, created_at) SELECT id, 'Assembly', 'https://pub-633dac494e3b4bdb808035bd3c437f27.r2.dev/unk-unk-zgmf-x666s-legend-gundam-assembly.pdf', 'JP', 0, '', 1772023451 FROM kits WHERE grade='HG' AND scale='1/144' AND name='Zgmf-x666s Legend Gundam' LIMIT 1;
