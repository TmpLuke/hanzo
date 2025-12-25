import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-16 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 25, 2024</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Hanzo Cheats ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect and process the following types of information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Personal Information:</strong> Email address, name (optional), and Discord username when you make a purchase</li>
                <li><strong>Payment Information:</strong> Processed securely through MoneyMotion (we do not store credit card details)</li>
                <li><strong>Order Information:</strong> Purchase history, order numbers, and product details</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage data</li>
                <li><strong>Communication Data:</strong> Messages sent through Discord support tickets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>To process and fulfill your orders</li>
                <li>To send order confirmations and product delivery information</li>
                <li>To provide customer support through Discord</li>
                <li>To prevent fraud and ensure security</li>
                <li>To improve our website and services</li>
                <li>To send important updates about our products (with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Storage and Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely using Supabase infrastructure with encryption at rest and in transit. Payment processing is handled by MoneyMotion with industry-standard security measures.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the following third-party services that may collect and process your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>MoneyMotion:</strong> Payment processing</li>
                <li><strong>Supabase:</strong> Database and backend services</li>
                <li><strong>Discord:</strong> Customer support and community</li>
                <li><strong>Gmail:</strong> Email delivery for order confirmations</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Each of these services has their own privacy policies governing how they handle your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies to ensure the proper functioning of our website. These cookies are necessary for features like maintaining your shopping cart and keeping you logged in. We do not use tracking cookies or third-party advertising cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this privacy policy. Order information is kept for accounting and legal compliance purposes. You can request deletion of your data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Portability:</strong> Request transfer of your data</li>
                <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise any of these rights, please contact us at petyaiscute@gmail.com or through our Discord server.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your data may be transferred to and processed in countries other than your own. We ensure that appropriate safeguards are in place to protect your data in accordance with this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date. You are advised to review this privacy policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>📧 Email: <a href="mailto:petyaiscute@gmail.com" className="text-primary hover:underline">petyaiscute@gmail.com</a></li>
                <li>💬 Discord: <a href="https://discord.gg/hanzo" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">discord.gg/hanzo</a></li>
                <li>🌐 Website: <a href="https://hanzocheats.com" className="text-primary hover:underline">hanzocheats.com</a></li>
              </ul>
            </section>

            <div className="mt-12 p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                By using Hanzo Cheats, you consent to the collection and use of your information as described in this Privacy Policy. If you do not agree with this policy, please do not use our Service.
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <Link to="/terms">
                <button className="px-6 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                  Terms of Service
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
