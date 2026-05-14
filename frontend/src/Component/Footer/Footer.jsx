import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container py-5">
        <div className="row g-5">
          {/* Brand & Description */}
          <div className="col-lg-4">
            <h2 className="fs-1 fw-bold mb-4">
              SQUA
              <span className="text-gradient">DF</span>
              INDER
            </h2>
            <p className="text-light opacity-80 lead">
              The ultimate Rainbow Six Siege companion. Find your perfect 5-stack, build your legacy roster, or grow your esports organization.
            </p>
            <p className="text-cyan small mt-3">
              115,264+ players • 10,453+ teams • Growing daily
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4">
            <h5 className="text-gradient fw-bold mb-4">QUICK LINKS</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Browse Players</a></li>
              <li><a href="#">Discover Teams</a></li>
              <li><a href="#">Scrim Finder </a></li>
              <li><a href="#">Streams & Content</a></li>
              <li><a href="#">Leaderboards</a></li>
            </ul>
          </div>

          {/* Discord & Social */}
          <div className="col-lg-4">
            <h5 className="text-gradient fw-bold mb-4">JOIN THE MOVEMENT</h5>
            <div className="discord-card glass p-4 text-center">
              <div className="discord-icon mb-3">Discord</div>
              <h4 className="fw-bold text-gradient">Official Community</h4>
              <div className="discord-link mt-3 p-3 rounded-3">
                discord.gg/dJcbrZ7
              </div>
              <a href="https://discord.gg/dJchrZ7" target="_blank">
              <button className="btn btn-glow btn-sm w-100 mt-3">
                Join Now
              </button>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-glow my-5" />

        <div className="text-center">
          <p className="text-light small opacity-70">
            © 2025 <span className="text-cyan">SQUADFINDER</span> — All rights reserved<br />
            <span className="text-secondary">
              Not affiliated with Ubisoft Entertainment or Rainbow Six Siege®
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}