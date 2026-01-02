import { useState } from "react";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import SectionTitle from "@/components/SectionTitle";
import { events, announcements } from "@/data/events";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState("SG");

  return (
    <div className="min-h-screen bg-background">
      <Header
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <main className="container py-8 space-y-12">
        {/* Events Section */}
        <section>
          <SectionTitle title="Events" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                image={event.image}
                startDate={event.startDate}
                endDate={event.endDate}
                status={event.status}
              />
            ))}
          </div>
        </section>

        {/* Announcements Section */}
        <section>
          <SectionTitle title="Announcements" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {announcements.map((announcement) => (
              <EventCard
                key={announcement.id}
                title={announcement.title}
                image={announcement.image}
                startDate={announcement.startDate}
                endDate={announcement.endDate}
                status={announcement.status}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Free Fire Events. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
