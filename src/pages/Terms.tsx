import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

export default function Terms() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 25, 2024</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using hanzocheats.com ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Permission is granted to temporarily download one copy of the materials (information or software) on Hanzo Cheats for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the Service</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Product Usage</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our products are digital gaming tools and cheats. By purchasing and using our products, you acknowledge that:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>You are solely responsible for how you use our products</li>
                <li>Using cheats may violate the terms of service of the games you play</li>
                <li>Your game accounts may be banned or suspended as a result of using our products</li>
                <li>We are not responsible for any consequences resulting from your use of our products</li>
                <li>You must be 18 years or older to purchase our products</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Account Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for maintaining the security of your account and password. Hanzo Cheats cannot and will not be liable for any loss or damage from your failure to comply with this security obligation. You are responsible for all activity that occurs under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Payment and Refunds</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All purchases are processed securely through MoneyMotion. By making a purchase, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide accurate and complete payment information</li>
                <li>Pay all charges at the prices in effect when incurred</li>
                <li>Understand that all sales are final unless otherwise stated</li>
                <li>Contact support via Discord for any payment issues</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Refunds are handled on a case-by-case basis. Please open a ticket in our Discord server to request a refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Product Delivery</h2>
              <p className="text-muted-foreground leading-relaxed">
                After successful payment, you will receive an email confirmation. To claim your product, you must open a ticket in our Discord server with your order number. Product keys and access will be provided through Discord support tickets.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may not use the Service:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on Hanzo Cheats are provided on an 'as is' basis. Hanzo Cheats makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall Hanzo Cheats or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Hanzo Cheats, even if Hanzo Cheats or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Detection and Bans</h2>
              <p className="text-muted-foreground leading-relaxed">
                We strive to provide undetected products, but we cannot guarantee that our products will remain undetected indefinitely. Game developers continuously update their anti-cheat systems. By using our products, you accept the risk of detection and potential account bans. We are not responsible for any bans or suspensions that may occur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Updates and Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to update, modify, or discontinue our products at any time without notice. We will make reasonable efforts to keep our products updated and functional, but we do not guarantee continuous availability or compatibility.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality on the Service are owned by Hanzo Cheats and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed and construed in accordance with applicable laws, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">16. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>📧 Email: <a href="mailto:petyaiscute@gmail.com" className="text-primary hover:underline">petyaiscute@gmail.com</a></li>
                <li>💬 Discord: <a href="https://discord.gg/hanzo" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">discord.gg/hanzo</a></li>
                <li>🌐 Website: <a href="https://hanzocheats.com" className="text-primary hover:underline">hanzocheats.com</a></li>
              </ul>
            </section>

            <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                By using Hanzo Cheats, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Link to="/privacy">
                <button className="px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                  Privacy Policy
                </button>
              </Link>
              <Link to="/products">
                <button className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
                  Browse Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
