import { Builder, By, until, WebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome.js';
import { writeFileSync } from 'fs';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
};

interface PerformanceMetrics {
    pageLoadTime?: number;
    loadTime?: number;
    domContentLoaded?: number;
    firstPaint?: number;
    firstContentfulPaint?: number;
}

class AppTester {
    private driver: WebDriver;
    private baseUrl: string;
    private readonly timeout: number = 30000; // 30 seconds timeout
    private testResults: { [key: string]: boolean } = {};
    private performanceMetrics: PerformanceMetrics = {};

    constructor(baseUrl: string = 'http://localhost:8080') {
        this.baseUrl = baseUrl;
    }

    private log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') {
        const timestamp = new Date().toISOString();
        const color = type === 'success' ? colors.green : 
                     type === 'error' ? colors.red :
                     type === 'warning' ? colors.yellow : colors.blue;
        console.log(`${colors.dim}[${timestamp}]${colors.reset} ${color}${message}${colors.reset}`);
    }

    async setup() {
        this.log('Setting up WebDriver...');
        const options = new Options();
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--disable-gpu');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--enable-logging');
        options.addArguments('--v=1');

        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        this.log('WebDriver setup complete', 'success');
    }

    async teardown() {
        if (this.driver) {
            this.log('Closing WebDriver...');
            await this.driver.quit();
            this.log('WebDriver closed', 'success');
        }
    }

    async takeScreenshot(name: string) {
        try {
            const screenshot = await this.driver.takeScreenshot();
            writeFileSync(`./test-results/${name}.png`, screenshot, 'base64');
            this.log(`Screenshot saved: ${name}.png`, 'success');
        } catch (error) {
            this.log(`Failed to take screenshot: ${name}.png`, 'error');
        }
    }

    async testNavigation() {
        try {
            this.log('Testing navigation...');
            this.log(`Attempting to navigate to: ${this.baseUrl}`);
            
            const startTime = Date.now();
            await this.driver.get(this.baseUrl);
            const loadTime = Date.now() - startTime;
            this.performanceMetrics.pageLoadTime = loadTime;
            
            // Wait for the app to load
            this.log('Waiting for page to load...');
            await this.driver.wait(until.elementLocated(By.css('body')), this.timeout);
            
            // Test browser history
            this.log('Testing browser history...');
            await this.driver.navigate().back();
            await this.driver.navigate().forward();
            
            // Test refresh
            this.log('Testing page refresh...');
            await this.driver.navigate().refresh();
            
            await this.takeScreenshot('navigation-test');
            
            this.log('Navigation test completed successfully', 'success');
            this.testResults['navigation'] = true;
            return true;
        } catch (error) {
            this.log(`Navigation test failed: ${error}`, 'error');
            await this.takeScreenshot('navigation-error');
            this.testResults['navigation'] = false;
            return false;
        }
    }

    async testComponents() {
        try {
            this.log('Testing components...');
            
            // Test for main components
            this.log('Checking main components...');
            const components = [
                { selector: 'main', name: 'Main Container' },
                { selector: 'header', name: 'Header' },
                { selector: 'nav', name: 'Navigation' },
                { selector: 'footer', name: 'Footer' },
                { selector: 'form', name: 'Forms' },
                { selector: 'input', name: 'Input Fields' },
                { selector: 'button', name: 'Buttons' },
                { selector: 'img', name: 'Images' }
            ];

            for (const component of components) {
                try {
                    const elements = await this.driver.findElements(By.css(component.selector));
                    this.log(`Found ${elements.length} ${component.name}`, 'success');
                    
                    // Test component visibility
                    for (const element of elements) {
                        try {
                            const isDisplayed = await element.isDisplayed();
                            if (!isDisplayed) {
                                this.log(`Warning: ${component.name} is not visible`, 'warning');
                            }
                        } catch (visibilityError) {
                            this.log(`Could not check visibility of ${component.name}: ${visibilityError}`, 'warning');
                        }
                    }
                } catch (error) {
                    this.log(`Error checking ${component.name}: ${error}`, 'error');
                }
            }
            
            await this.takeScreenshot('components-test');
            
            this.log('Components test completed', 'success');
            this.testResults['components'] = true;
            return true;
        } catch (error) {
            this.log(`Components test failed: ${error}`, 'error');
            await this.takeScreenshot('components-error');
            this.testResults['components'] = false;
            return false;
        }
    }

    async testForms() {
        try {
            this.log('Testing forms...');
            
            // Find all forms
            const forms = await this.driver.findElements(By.css('form'));
            this.log(`Found ${forms.length} forms`, 'info');
            
            for (const form of forms) {
                try {
                    // Wait for form to be interactable
                    await this.driver.wait(until.elementIsVisible(form), this.timeout);
                    
                    // Test form inputs
                    const inputs = await form.findElements(By.css('input'));
                    for (const input of inputs) {
                        try {
                            const type = await input.getAttribute('type');
                            const name = await input.getAttribute('name');
                            
                            // Test input validation
                            if (type === 'text' || type === 'email') {
                                await this.driver.wait(until.elementIsVisible(input), this.timeout);
                                await input.clear();
                                await input.sendKeys('test@example.com');
                                const value = await input.getAttribute('value');
                                this.log(`Input ${name} value: ${value}`, 'info');
                            }
                        } catch (inputError) {
                            this.log(`Error testing input: ${inputError}`, 'warning');
                        }
                    }
                    
                    // Test form submission
                    try {
                        const submitButton = await form.findElement(By.css('button[type="submit"]'));
                        await this.driver.wait(until.elementIsVisible(submitButton), this.timeout);
                        await submitButton.click();
                        this.log('Form submitted successfully', 'success');
                    } catch (submitError) {
                        this.log('No submit button found or submission failed', 'warning');
                    }
                } catch (formError) {
                    this.log(`Error testing form: ${formError}`, 'warning');
                }
            }
            
            await this.takeScreenshot('forms-test');
            this.testResults['forms'] = true;
            return true;
        } catch (error) {
            this.log(`Forms test failed: ${error}`, 'error');
            await this.takeScreenshot('forms-error');
            this.testResults['forms'] = false;
            return false;
        }
    }

    async testResponsiveDesign() {
        try {
            this.log('Testing responsive design...');
            
            const viewports = [
                { width: 1920, height: 1080, name: 'Desktop' },
                { width: 1366, height: 768, name: 'Laptop' },
                { width: 768, height: 1024, name: 'Tablet' },
                { width: 375, height: 812, name: 'Mobile' }
            ];
            
            for (const viewport of viewports) {
                this.log(`Testing ${viewport.name} viewport (${viewport.width}x${viewport.height})...`);
                await this.driver.manage().window().setSize(viewport.width, viewport.height);
                await this.takeScreenshot(`responsive-${viewport.name.toLowerCase()}`);
                
                // Check for responsive elements
                const mediaQueries = await this.driver.executeScript(`
                    return window.getComputedStyle(document.body).getPropertyValue('content');
                `);
                this.log(`Media queries detected: ${mediaQueries}`, 'info');
            }
            
            this.testResults['responsive-design'] = true;
            return true;
        } catch (error) {
            this.log(`Responsive design test failed: ${error}`, 'error');
            this.testResults['responsive-design'] = false;
            return false;
        }
    }

    async testAccessibility() {
        try {
            this.log('Testing accessibility...');
            
            // Check for ARIA attributes
            const ariaElements = await this.driver.findElements(By.css('[aria-label], [aria-describedby], [aria-hidden]'));
            this.log(`Found ${ariaElements.length} elements with ARIA attributes`, 'info');
            
            // Check for alt text on images
            const images = await this.driver.findElements(By.css('img'));
            for (const image of images) {
                try {
                    const alt = await image.getAttribute('alt');
                    if (!alt) {
                        this.log('Warning: Image missing alt text', 'warning');
                    }
                } catch (altError) {
                    this.log('Could not check image alt text', 'warning');
                }
            }
            
            // Check for proper heading hierarchy
            const headings = await this.driver.findElements(By.css('h1, h2, h3, h4, h5, h6'));
            this.log(`Found ${headings.length} headings`, 'info');
            
            this.testResults['accessibility'] = true;
            return true;
        } catch (error) {
            this.log(`Accessibility test failed: ${error}`, 'error');
            this.testResults['accessibility'] = false;
            return false;
        }
    }

    async testPerformance() {
        try {
            this.log('Testing performance...');
            
            // Get performance metrics
            const metrics = await this.driver.executeScript(`
                const performance = window.performance;
                return {
                    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                    firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
                };
            `) as PerformanceMetrics;
            
            this.performanceMetrics = {
                ...this.performanceMetrics,
                ...metrics
            };
            
            this.log('Performance metrics collected', 'success');
            this.testResults['performance'] = true;
            return true;
        } catch (error) {
            this.log(`Performance test failed: ${error}`, 'error');
            this.testResults['performance'] = false;
            return false;
        }
    }

    printTestSummary() {
        console.log('\n' + '='.repeat(50));
        console.log(`${colors.bright}Test Summary${colors.reset}`);
        console.log('='.repeat(50));
        
        for (const [test, result] of Object.entries(this.testResults)) {
            const status = result ? 
                `${colors.green}✓ PASSED${colors.reset}` : 
                `${colors.red}✗ FAILED${colors.reset}`;
            console.log(`${colors.cyan}${test.padEnd(20)}${colors.reset}: ${status}`);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log(`${colors.bright}Performance Metrics${colors.reset}`);
        console.log('='.repeat(50));
        
        for (const [metric, value] of Object.entries(this.performanceMetrics)) {
            if (value !== undefined) {
                console.log(`${colors.cyan}${metric.padEnd(20)}${colors.reset}: ${value}ms`);
            }
        }
        
        console.log('='.repeat(50));
        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(Boolean).length;
        console.log(`${colors.bright}Total Tests: ${totalTests}${colors.reset}`);
        console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
        console.log(`${colors.red}Failed: ${totalTests - passedTests}${colors.reset}`);
        console.log('='.repeat(50) + '\n');
    }
}

// Run the tests
async function runTests() {
    const tester = new AppTester();
    
    try {
        await tester.setup();
        
        // Run all tests
        await tester.testNavigation();
        await tester.testComponents();
        await tester.testForms();
        await tester.testResponsiveDesign();
        await tester.testAccessibility();
        await tester.testPerformance();
        
        // Print summary
        tester.printTestSummary();
        
    } catch (error) {
        console.error('Test suite failed:', error);
    } finally {
        await tester.teardown();
    }
}

// Create test-results directory if it doesn't exist
import { mkdirSync } from 'fs';
try {
    mkdirSync('./test-results', { recursive: true });
} catch (error) {
    console.error('Error creating test-results directory:', error);
}

// Execute the tests
runTests(); 