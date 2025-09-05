/**
 * Jules Orchestrator Agent
 * Manages task planning and review for Jules AI integration
 * Bridges local development with external Jules service
 */

class JulesOrchestrator {
    constructor() {
        this.name = 'Jules Orchestrator';
        this.version = '1.0.0';
        this.capabilities = [
            'task_planning',
            'pr_review',
            'integration_management',
            'quality_assurance'
        ];
        
        this.taskQueue = [];
        this.activeJulesTasks = new Map();
        this.completedTasks = [];
        
        this.rfflContext = this.loadRFFLContext();
        this.init();
    }

    init() {
        console.log('🤖 Jules Orchestrator Agent initialized');
        this.loadTaskTemplates();
    }

    loadRFFLContext() {
        return {
            projectType: 'RFFL Week 1 Median System',
            codebase: 'Vanilla JS + Tailwind CSS',
            deployment: 'GitHub Pages',
            mainBranch: 'main',
            liveUrl: 'https://thorsenk.github.io/rffl-week-won/',
            criticalFiles: [
                'live-mobile.html',
                'js/espn-api.js',
                'js/median-calculator.js',
                'js/rffl-data.js'
            ],
            businessLogic: {
                scoring: 'median-based (6th + 7th place average)',
                teams: 12,
                coOwnership: 'supported',
                liveUpdates: '30-second intervals',
                fallbackData: 'simulated when API fails'
            }
        };
    }

    loadTaskTemplates() {
        this.taskTemplates = {
            testing: {
                priority: 'high',
                safety: 'safe',
                template: `Add comprehensive unit tests for {component}. Include tests for:
- Core functionality and edge cases
- Error handling and fallback scenarios  
- Mobile responsiveness and touch interactions
- Performance under load
- Integration with RFFL median scoring logic

Follow existing code patterns and ensure tests run in browser environment. Maintain mobile-first approach.`
            },
            
            performance: {
                priority: 'medium',
                safety: 'safe',
                template: `Optimize {component} for mobile game-day performance:
- Reduce bundle size and minimize dependencies
- Implement lazy loading for non-critical resources
- Add resource preloading for critical assets
- Optimize images and fonts for mobile networks
- Ensure sub-3-second load times on 3G connections

Preserve all existing functionality and RFFL median scoring logic.`
            },
            
            pwa: {
                priority: 'medium', 
                safety: 'safe',
                template: `Convert RFFL app to Progressive Web App:
- Add service worker for offline functionality
- Implement app manifest for add-to-homescreen
- Cache critical resources for offline median calculations
- Add background sync for score updates
- Ensure works without network during games

Maintain existing mobile UI and live refresh capabilities.`
            },
            
            accessibility: {
                priority: 'high',
                safety: 'safe',
                template: `Enhance accessibility for {component}:
- Add ARIA labels and screen reader support
- Implement keyboard navigation for all interactions
- Ensure color contrast meets WCAG AA standards
- Add focus indicators and skip links
- Test with screen readers (VoiceOver, NVDA)

Preserve mobile-first design and live scoring functionality.`
            },
            
            analytics: {
                priority: 'low',
                safety: 'safe', 
                template: `Add privacy-focused analytics to track:
- Page views and session duration
- Mobile vs desktop usage patterns
- Live refresh engagement metrics
- Error rates and fallback data usage
- Performance metrics (load times, interactions)

Use privacy-first analytics (no PII collection). Maintain RFFL median focus.`
            }
        };
    }

    /**
     * Generate a Jules task plan for specific enhancement
     */
    generateJulesTask(taskType, component = null, customRequirements = []) {
        const template = this.taskTemplates[taskType];
        if (!template) {
            throw new Error(`Unknown task type: ${taskType}`);
        }

        const taskId = `jules-${taskType}-${Date.now()}`;
        const componentName = component || this.suggestComponent(taskType);
        
        let taskDescription = template.template.replace('{component}', componentName);
        
        // Add custom requirements
        if (customRequirements.length > 0) {
            taskDescription += '\n\nAdditional Requirements:\n' + 
                customRequirements.map(req => `- ${req}`).join('\n');
        }
        
        // Add RFFL-specific context
        taskDescription += '\n\nRFFL Context:\n' +
            `- League: 12 teams with median-based scoring\n` +
            `- Mobile-first design for game-day use\n` +
            `- Live updates every 30 seconds during games\n` +
            `- Fallback to simulated data when ESPN API unavailable\n` +
            `- Production URL: ${this.rfflContext.liveUrl}`;

        const task = {
            id: taskId,
            type: taskType,
            component: componentName,
            priority: template.priority,
            safety: template.safety,
            description: taskDescription,
            status: 'planned',
            createdAt: new Date().toISOString(),
            julesInstructions: this.formatForJules(taskDescription),
            reviewChecklist: this.generateReviewChecklist(taskType)
        };

        this.taskQueue.push(task);
        return task;
    }

    /**
     * Format task description for pasting into jules.google.com
     */
    formatForJules(description) {
        return {
            prompt: description,
            branch: `jules-enhancement-${Date.now()}`,
            setupInstructions: [
                'npm install -g http-server',
                'http-server . -p 8000',
                'echo "RFFL development server running on localhost:8000"'
            ]
        };
    }

    /**
     * Generate review checklist for Jules output
     */
    generateReviewChecklist(taskType) {
        const baseChecklist = [
            '✅ Code follows existing patterns and style',
            '✅ Mobile-first approach maintained',
            '✅ RFFL median scoring logic preserved',
            '✅ Fallback data system intact',
            '✅ No breaking changes to live functionality',
            '✅ Performance impact acceptable',
            '✅ Browser compatibility maintained'
        ];

        const typeSpecific = {
            testing: [
                '✅ Tests cover median calculation edge cases',
                '✅ Mock data matches RFFL team structure',
                '✅ Tests run in browser environment'
            ],
            performance: [
                '✅ Bundle size reduced or maintained',
                '✅ Load time improvements measured',
                '✅ Mobile performance optimized'
            ],
            pwa: [
                '✅ Service worker properly configured',
                '✅ Offline functionality works',
                '✅ App manifest valid'
            ],
            accessibility: [
                '✅ Screen reader compatibility verified',
                '✅ Keyboard navigation functional',
                '✅ Color contrast meets standards'
            ]
        };

        return [...baseChecklist, ...(typeSpecific[taskType] || [])];
    }

    /**
     * Suggest appropriate component for task type
     */
    suggestComponent(taskType) {
        const suggestions = {
            testing: 'median calculation and data loading logic',
            performance: 'live-mobile.html and asset loading',
            pwa: 'entire RFFL application',
            accessibility: 'live scoring interface',
            analytics: 'user engagement tracking'
        };
        return suggestions[taskType] || 'core application';
    }

    /**
     * Review Jules-generated PR/branch
     */
    async reviewJulesOutput(taskId, prUrl, branchName) {
        const task = this.taskQueue.find(t => t.id === taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        const review = {
            taskId,
            prUrl,
            branchName,
            reviewedAt: new Date().toISOString(),
            checklist: task.reviewChecklist,
            status: 'pending_review',
            recommendations: [],
            approvalStatus: 'pending'
        };

        // Add to active tasks for tracking
        this.activeJulesTasks.set(taskId, review);
        
        console.log(`📋 Review started for Jules task: ${task.type}`);
        console.log(`🔗 PR URL: ${prUrl}`);
        console.log(`🌿 Branch: ${branchName}`);
        console.log('\n📝 Review Checklist:');
        task.reviewChecklist.forEach(item => console.log(item));

        return review;
    }

    /**
     * Get formatted task for Kyle to paste into Jules
     */
    getJulesTaskInstructions(taskId) {
        const task = this.taskQueue.find(t => t.id === taskId);
        if (!task) {
            throw new Error(`Task ${taskId} not found`);
        }

        return {
            title: `RFFL Enhancement: ${task.type} for ${task.component}`,
            description: task.description,
            branch: task.julesInstructions.branch,
            setupCommands: task.julesInstructions.setupInstructions.join('\n'),
            priority: task.priority,
            safety: task.safety
        };
    }

    /**
     * Queue multiple enhancement tasks
     */
    planEnhancementSprint() {
        const sprintTasks = [
            this.generateJulesTask('testing', 'median calculator'),
            this.generateJulesTask('performance', 'mobile loading'),
            this.generateJulesTask('accessibility', 'live interface'),
            this.generateJulesTask('pwa', 'full application')
        ];

        console.log(`🚀 Enhancement sprint planned with ${sprintTasks.length} tasks`);
        return sprintTasks;
    }

    /**
     * Get status of all Jules tasks
     */
    getTaskStatus() {
        return {
            planned: this.taskQueue.filter(t => t.status === 'planned'),
            active: Array.from(this.activeJulesTasks.values()),
            completed: this.completedTasks,
            total: this.taskQueue.length
        };
    }
}

// Export for use in other agents
window.JulesOrchestrator = JulesOrchestrator;

// Initialize if in browser environment
if (typeof window !== 'undefined') {
    window.julesOrchestrator = new JulesOrchestrator();
}
