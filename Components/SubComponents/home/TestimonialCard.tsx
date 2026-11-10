'use client';

import React from 'react'
import { TestimonialCardProps } from '@/types/dataType';
import { motion } from 'framer-motion';

const TestimonialCard: React.FC<TestimonialCardProps & { index?: number }> = ({ data, index = 0 }) => {
    const { name, company, feedback } = data;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
                duration: 0.6,
                ease: "easeOut",
                delay: index * 0.1
            }}
            whileHover={{
                y: -5,
                transition: { duration: 0.2 }
            }}
            className="bg-[#f6f6f6] rounded-xl p-8 full shadow-lg hover:shadow-xl transition-shadow duration-200 border border-[#f6f6f6]"
        >
            <motion.h3
                className="text-xl font-medium text-[#454648] mb-1"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
            >
                {name}
            </motion.h3>
            <motion.p
                className="text-lg text-[#454648]/75 mb-6"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
            >
                {company}
            </motion.p>
            <motion.p
                className="text-base text-[#454648]/80 leading-relaxed"
                initial={{ opacity: 0.8 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
            >
                "{feedback}"
            </motion.p>
        </motion.div>
    );
};

export default TestimonialCard
