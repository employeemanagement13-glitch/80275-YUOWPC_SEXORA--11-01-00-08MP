"use client"
import React, { useState, useEffect } from 'react'
import SectionHeader from '../SubComponents/SectionHeader';
import BlogCard from '../SubComponents/home/BlogCard';
import CallToActionButton from '../SubComponents/CallToActionButton';
import { supabase } from '@/utils/supabaseClient';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface BlogCardData {
  id?: string | number;
  title: string;
  summary?: string;
  blogid?: string;
  imagePath: string;
  date?: string;
  category?: string;
}

type Opportunity = {
  id: string;
  position: string;
  description: string;
  image: string;
  link: string | null;
  created_at: string;
};

// --- 4. BeAPartSection (Main Component) ---
const BeAPartSection: React.FC = () => {
  const [jobData, setJobData] = useState<BlogCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  // Helper function to get full image URL
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/pathway/soc.png'; // Fallback image
    if (imagePath.startsWith('blob:') || imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/opportunity-images/${imagePath}`;
  };

  // Transform opportunity data to BlogCardData
  const transformOpportunityToBlogCard = (opp: Opportunity): BlogCardData => {
    return {
      id: opp.id,
      title: opp.position,
      summary: opp.description,
      blogid: opp.link || "#careers", // Use link if available, otherwise fallback
      imagePath: getImageUrl(opp.image),
      date: opp.created_at,
      category: "Opportunity"
    };
  };

  // Fetch initial data and set up real-time subscription
  useEffect(() => {
    let mounted = true;

    const fetchOpportunitiesAndSubscribe = async () => {
      try {
        // Initial fetch
        const { data: opportunities, error } = await supabase
          .from("opportunities")
          .select("*")
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (error) {
          console.error("Error fetching opportunities:", error);
        } else if (opportunities) {
          const transformed = opportunities.map(transformOpportunityToBlogCard);
          setJobData(transformed);
        }
        setLoading(false);

        // Set up real-time subscription
        const channel = supabase
          .channel('opportunities-public-changes')
          .on(
            'postgres_changes',
            {
              event: '*', // INSERT, UPDATE, DELETE
              schema: 'public',
              table: 'opportunities'
            },
            async (payload: RealtimePostgresChangesPayload<Opportunity>) => {
              // Fetch fresh data when changes occur
              const { data: freshOpportunities, error: fetchError } = await supabase
                .from("opportunities")
                .select("*")
                .order("created_at", { ascending: false });

              if (fetchError) {
                console.error("Error fetching fresh opportunities:", fetchError);
                return;
              }

              if (freshOpportunities && mounted) {
                const transformed = freshOpportunities.map(transformOpportunityToBlogCard);
                setJobData(transformed);
              }
            }
          )
          .subscribe((status) => {
            if (mounted) {
              setIsConnected(status === "SUBSCRIBED");
            }
          });

        // Cleanup function
        return () => {
          mounted = false;
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up opportunities:', error);
        setLoading(false);
      }
    };

    fetchOpportunitiesAndSubscribe();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="max-w-6xl mx-auto py-16 sm:py-24 text-white font-sans px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header Component */}
        <SectionHeader
          title="Be A Part"
          subtitle="The Principles that Shape Our Identity and Drive Our Work"
          className="mb-12 sm:mb-20"
        />

        {/* Connection Status Indicator */}
        {/* <div className="flex justify-end items-center mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="text-xs text-[#454648]/70">
              {isConnected ? 'Live updates enabled' : 'Connecting...'}
            </span>
          </div>
        </div> */}

        {/* Job Cards Grid */}
        <div className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
          gap-8 
          mb-16 sm:mb-20
        ">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-gray-800 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              </div>
            ))
          ) : jobData.length === 0 ? (
            // No opportunities message
            <div className="col-span-full text-center py-12">
              <p className="text-[#454648]/70 text-lg mb-2">
                No opportunities available at the moment
              </p>
              <p className="text-[#454648]/60 text-sm">
                Check back soon for new openings
              </p>
            </div>
          ) : (
            // Actual job cards
            jobData.map((job, index) => (
              <BlogCard
                key={job.id}
                data={job}
                showReadMore={!!job.blogid && job.blogid !== "#careers"}
                readMoreText={job.blogid && job.blogid !== "#careers" ? "Apply Now" : "Learn More"}
                href={job.blogid || "#careers"}
                index={index}
              />
            ))
          )}
        </div>

        {/* Button Component */}
        <div className="text-center">
          <CallToActionButton
            text="Explore Opportunities"
          href="https://linkedin.com/aroxes"
          />
        </div>
      </div>
    </section>
  );
};

export default BeAPartSection;