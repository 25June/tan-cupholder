'use client';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { durationLeft, durationRight, menus, socialMedias } from './constant';
import { yuseiMagic } from '@/styles/fonts';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const MotionLink = motion(Link);
export default function Footer() {
  const t = useTranslations('HomePage.FooterSection');
  const route = useRouter();
  return (
    <div className="bg-logo-orange-border">
      <footer className="text-[16px] text-white max-w-8xl mx-auto leading-[24px] grid sm:grid-cols-2 grid-cols-1 justify-between  sm:px-8 px-4 py-[40px] sm:py-[64px] font-bold">
        <motion.div
          className="flex flex-col sm:gap-3 gap-5 md:justify-between"
          initial="offscreen"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            offscreen: {
              transition: {
                staggerChildren: 1,
                delayChildren: 1
              }
            },
            visible: {
              transition: {
                staggerChildren: 0.2,
                staggerDirection: 1
              }
            }
          }}
        >
          <motion.img
            viewport={{ once: true }}
            src="/logo.png"
            className="w-[134px] rounded-full"
            alt="logo"
            variants={durationLeft}
          />
          <motion.p
            viewport={{ once: true }}
            variants={durationLeft}
            className="!opacity-70"
          >
            {t('address')}
          </motion.p>
          <motion.div
            viewport={{ once: true }}
            className="flex flex-col sm:gap-3 gap-5 justify-between"
          >
            <motion.a
              target="_blank"
              viewport={{ once: true }}
              variants={durationLeft}
              href="tel:0808 501 4080"
              className="hover:text-white w-fit !opacity-70"
              whileHover={{ x: 3 }}
              whileTap={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {t('phone')}
            </motion.a>
            <motion.a
              target="_blank"
              viewport={{ once: true }}
              variants={durationLeft}
              href="mailto:hello@predictmobile.com"
              className="text-white w-fit"
              whileHover={{ x: 3 }}
              whileTap={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              {t('email')}
            </motion.a>
            <motion.div
              className="flex gap-4"
              viewport={{ once: true }}
              initial="offscreen"
              whileInView="visible"
              variants={{
                offscreen: {
                  transition: {
                    staggerChildren: 1,
                    delayChildren: 1
                  }
                },
                visible: {
                  transition: {
                    staggerChildren: 0.5,
                    staggerDirection: 1
                  }
                }
              }}
            >
              {socialMedias.map((socialMedia, index) => (
                <motion.a
                  target="_blank"
                  viewport={{ once: true }}
                  href={socialMedia.link}
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  variants={{
                    offscreen: {
                      opacity: 0,
                      scale: 0
                    },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                      }
                    }
                  }}
                  className="bg-white rounded-full w-[48px] h-[48px] flex items-center justify-center"
                >
                  <img src={socialMedia.image} alt="social-media" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            viewport={{ once: true }}
            variants={durationLeft}
            className="md:hidden sm:flex hidden flex-col sm:gap-3 gap-5 mt-auto !opacity-50"
          >
            <p>
              {t('copyright', {
                year: new Date().getFullYear()
              })}
            </p>
            <span>{t('allRightsReserved')}</span>
          </motion.div>
        </motion.div>
        <motion.div
          viewport={{ once: true }}
          initial="offscreen"
          whileInView="visible"
          variants={{
            offscreen: {
              transition: {
                staggerChildren: 1,
                delayChildren: 1
              }
            },
            visible: {
              transition: {
                staggerChildren: 0.3,
                staggerDirection: 1
              }
            }
          }}
          className="flex flex-col sm:gap-3 gap-10 md:pt-0 sm:pt-[32px] pt-10"
        >
          <motion.p
            viewport={{ once: true }}
            variants={durationRight}
            className={`md:block sm:hidden block font-black text-white text-[20px] leading-[30px] ${yuseiMagic.className}`}
          >
            More Details
          </motion.p>
          <motion.div
            viewport={{ once: true }}
            initial="offscreen"
            whileInView="visible"
            variants={{
              offscreen: {
                transition: {
                  staggerChildren: 1,
                  delayChildren: 1
                }
              },
              visible: {
                transition: {
                  staggerChildren: 0.2,
                  staggerDirection: 1
                }
              }
            }}
            className="grid md:grid-cols-3 sm:grid-cols-1 grid-cols-2 gap-4 md:self-start sm:self-end"
          >
            <motion.p
              viewport={{ once: true }}
              variants={durationRight}
              className={`md:hidden sm:block hidden text-white font-black text-[20px] leading-[30px] ${yuseiMagic.className}`}
            >
              {t('moreDetails')}
            </motion.p>
            {menus(t).map((menu, index) => (
              <motion.div
                key={index}
                viewport={{ once: true }}
                className="flex flex-col sm:gap-3 gap-5"
              >
                {menu.map((item) => (
                  <MotionLink
                    prefetch={true}
                    viewport={{ once: true }}
                    href={item.href}
                    whileHover={{ x: 3 }}
                    whileTap={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    variants={{
                      offscreen: {
                        opacity: 0,
                        scale: 0
                      },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        transition: {
                          duration: 0.5,
                          ease: [0, 0.71, 0.2, 1.01]
                        }
                      }
                    }}
                    className="text-[16px] w-fit leading-[24px] opacity-70 hover:opacity-100"
                    key={item.name}
                  >
                    {item.name}
                  </MotionLink>
                ))}
              </motion.div>
            ))}
            <motion.div
              viewport={{ once: true }}
              variants={durationRight}
              className="md:flex hidden flex-col sm:gap-3 gap-5"
            >
              <p>
                {t('copyright', {
                  year: new Date().getFullYear()
                })}
              </p>
              <span>{t('allRightsReserved')}</span>
            </motion.div>
          </motion.div>
          <motion.div
            viewport={{ once: true }}
            variants={durationLeft}
            className="sm:hidden flex flex-col gap-5"
          >
            <p>
              {t('copyright', {
                year: new Date().getFullYear()
              })}
            </p>
            <span>{t('allRightsReserved')}</span>
          </motion.div>
        </motion.div>
      </footer>
    </div>
  );
}
