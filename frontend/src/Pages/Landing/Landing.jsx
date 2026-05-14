import "bootstrap/dist/css/bootstrap.min.css";
import "./Landing.css";
import { ChevronRight, Users } from "lucide-react";


export default function Landing() {
  return (
    <div className="landing-page">

      {/* Hero Section */}
      <section className="hero-section">
        {/* Floating Particles */}
        
        <div className="container py-5">
          <div className="row align-items-center g-5 min-vh-100">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold lh-1 text-gradient">
                Ditch the <span className="text-pink">solo-queue</span>,<br />
                find players and join teams
              </h1>
              <p className="lead mt-4 text-light opacity-90">
                Create your Siege profile with your main operators, rank, and more. Then,<br />
                browse our <strong className="text-cyan">115,264 players</strong> or request to join one of our{" "}
                <strong className="text-cyan">10,453 teams</strong>.
              </p>

              <div className="mt-5 d-flex flex-column flex-sm-row gap-3">
                <button className="btn btn-glow btn-lg px-5 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2">
                  Create your Siege profile <ChevronRight size={24} />
                </button>
                <button className="btn btn-outline-glow btn-lg px-5 py-3 rounded-pill d-flex align-items-center justify-content-center gap-2">
                  <Users size={24} /> Browse Players
                </button>
              </div>
            </div>

            <div className="col-lg-6 position-relative">
              {/* Floating Team Cards */}
              <div className="team-card glass" style={{ top: "8%", left: "5%" }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 fw-bold">Seismic</h5>
                    <small>United Kingdom • PC</small>
                  </div>
                  <div className="card-avatar"></div>
                </div>
                <div className="rank-badge">DIAMOND</div>
              </div>

              <div className="team-card glass" style={{ top: "32%", right: "8%" }}>
                <h5 className="mb-1 fw-bold">Section 1</h5>
                <small>United Kingdom • PC</small>
                <div className="rank-badge">PLATINUM</div>
              </div>

              <div className="team-card glass" style={{ bottom: "5vh", left: "24vh" }}>
                <h5 className="mb-1 fw-bold">Novalis eSports</h5>
                <small>Europe • PC</small>
                <div className="rank-badge champion">CHAMPION</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="container text-center">
          <h2 className="display-5 fw-bold">Welcome to the new Siegrs.GG!</h2>
          <p className="lead">We've been hard at work over the past months bringing you the ultimate Siege companion.</p>
        </div>
      </div>

      {/* Player Profile Section */}
      <section className="player-profile py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-4 fw-bold text-gradient">
                Personalize your<br />Player Profile
              </h2>
              <p className="lead mt-4 text-light">
                Show off your rank, main operators, platform, playstyle — everything teams need to recruit you.
              </p>
              <p className="lead text-light opacity-80">
                From Champion 5-stacks to casual clans — find your perfect squad.
              </p>
              <button className="btn btn-glow btn-lg px-5 py-3 rounded-pill mt-4 d-flex align-items-center gap-2">
                Create your Profile <ChevronRight size={24} />
              </button>
            </div>
            <div className="col-lg-6">
              <div className="profile-card glass">
                <div className="profile-bg"></div>
                <div className="card-body text-white p-4">
                  <h4 className="fw-bold mb-4 text-gradient">MAIN OPERATORS</h4>
                  <div className="row g-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="col-2">
                        <div className="operator-box glow"></div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-3 small opacity-80">
                    Defenders Attackers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Management */}
      <section className="team-management py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-4 fw-bold text-gradient">Build & Manage<br />Your Team</h2>
              <p className="lead mt-4 text-light">
                Create a team page, set rank requirements, recruit players, and dominate ladders.
              </p>
              <button className="btn btn-glow-alt btn-lg px-5 py-3 rounded-pill mt-4 d-flex align-items-center gap-2">
                Create a Team <ChevronRight size={24} />
              </button>
            </div>
            <div className="col-lg-6">
              <div className="roster-card glass p-4">
                <h3 className="mb-4 d-flex align-items-center gap-3 text-gradient">
                  <Users /> ROSTER
                </h3>
                <small className="text-pink">OWNER</small>
                <div className="member-box d-flex align-items-center gap-3 mt-3 p-3 rounded-3">
                  <div className="avatar-circle glow"></div>
                  <div>
                    <div className="fw-bold text-cyan">CH.KniFely</div>
                    <div className="d-flex gap-2 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="operator-mini glow"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

