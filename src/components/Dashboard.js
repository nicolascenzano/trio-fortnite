// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { supabase } from '../supabaseClient';
import '../CSS/dashboard.css';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [studentsPerCareer, setStudentsPerCareer] = useState([]);
  const [topCertificates, setTopCertificates] = useState([]);
  const [certificatesPerCareer, setCertificatesPerCareer] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStudentsPerCareer = async () => {
      const { data, error } = await supabase.from('userinfo').select('career');
      if (error) {
        console.error('Error fetching students per career:', error);
      } else {
        console.log('Fetched student data:', data); // Log fetched data

        const careerCount = data.reduce((acc, user) => {
          acc[user.career] = (acc[user.career] || 0) + 1;
          return acc;
        }, {});

        console.log('Career count:', careerCount); // Log career count

        const careerCountArray = Object.entries(careerCount).map(([career, count]) => {
          const translatedCareer = t(`${career}`);
          console.log(`Translating career ${career} to ${translatedCareer}`); // Log translation
          return { career: translatedCareer, count };
        });

        setStudentsPerCareer(careerCountArray);
      }
    };

    const fetchTopCertificates = async () => {
      const { data, error } = await supabase.from('pdfinfo').select('verificate, pdfname');
      if (error) {
        console.error('Error fetching top certificates:', error);
      } else {
        console.log('Fetched certificate data:', data); // Log fetched data

        const certificateCount = data.reduce((acc, { pdfname }) => {
          acc[pdfname] = (acc[pdfname] || 0) + 1;
          return acc;
        }, {});

        console.log('Certificate count:', certificateCount); // Log certificate count

        const sortedCertificates = Object.entries(certificateCount)
          .map(([pdfname, count]) => ({ pdfname, count }))
          .sort((a, b) => b.count - a.count);

        setTopCertificates(sortedCertificates);
      }
    };

    const fetchCertificatesPerCareer = async () => {
      const { data, error } = await supabase.from('certificates').select('*');
      if (error) {
        console.error('Error fetching certificates per career:', error);
      } else {
        console.log('Fetched certificate data:', data); // Log fetched data

        const careerCertificates = data.reduce((acc, cert) => {
          acc[cert.career] = (acc[cert.career] || 0) + 1;
          return acc;
        }, {});

        console.log('Career certificates count:', careerCertificates); // Log career certificates count

        const careerCertificatesArray = Object.entries(careerCertificates).map(([career, count]) => {
          const translatedCareer = t(`${career}`);
          console.log(`Translating career ${career} to ${translatedCareer}`); // Log translation
          return { career: translatedCareer, count };
        });

        setCertificatesPerCareer(careerCertificatesArray);
      }
    };

    fetchStudentsPerCareer();
    fetchTopCertificates();
    fetchCertificatesPerCareer();
  }, [t]);

  return (
    <div className="dashboard-container">
      <h1>{t('dashboard.title')}</h1>
      <div className="chart-container">
        <div className="chart-wrapper">
          <div className="chart">
            <h2>{t('dashboard.chart1')}</h2>
            <BarChart width={500} height={400} data={studentsPerCareer}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="career" interval={0} angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend width={390} height={100}/>
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </div>
        </div>
        <div className="chart-wrapper">
          <div className="chart">
            <h2>{t('dashboard.chart2')}</h2>
            <BarChart width={500} height={450} data={certificatesPerCareer}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="career" interval={0} angle={-30} textAnchor="end" />
              <YAxis />
              <Tooltip />
              <Legend width={690} height={100}/>
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
        <div className="list-wrapper">
          <h2>{t('dashboard.chart3')}</h2>
          <ol>
            {topCertificates.map((item, index) => (
              <li key={index}>
                {item.pdfname} ({t('dashboard.user')} {item.count} {t('dashboard.user2')})
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;