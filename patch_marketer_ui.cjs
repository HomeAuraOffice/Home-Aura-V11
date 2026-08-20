const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetHtml = `<!-- Financial Metrics Cards Grid -->`;
const replaceHtml = `<div v-if="currentUser.role !== 'marketer'" class="space-y-6">
            <!-- Financial Metrics Cards Grid -->`;

html = html.replace(targetHtml, replaceHtml);

const steadfastEndHtml = `              </div>
            </div>

            <!-- Merchant Live Sales Performance vs Target Progress Bars -->`;

const replaceSteadfastEndHtml = `              </div>
            </div>
            </div> <!-- End of Marketer Hidden Section -->

            <!-- Merchant Live Sales Performance vs Target Progress Bars -->`;

html = html.replace(steadfastEndHtml, replaceSteadfastEndHtml);

fs.writeFileSync('index.html', html);
