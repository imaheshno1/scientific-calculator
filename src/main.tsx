// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Add Scientific Calculator',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Submitting your calculator - upon completion you'll navigate there.");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'Scientific Calculator',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading Calculator...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

// Add a post type definition for Scientific Calculator
Devvit.addCustomPostType({
  name: 'Scientific Calculator',
  height: 'tall',
  render: (_context) => {
    const [display, setDisplay] = useState('0');
    const [secondaryDisplay, setSecondaryDisplay] = useState('');
    const [operator, setOperator] = useState('');
    const [firstValue, setFirstValue] = useState('');
    const [clearNext, setClearNext] = useState(false);

    const handleNumberClick = (value: string) => {
      if (clearNext) {
        setDisplay(value);
        setClearNext(false);
      } else {
        setDisplay(display === '0' ? value : display + value);
      }
    };

    const handleOperatorClick = (op: string) => {
      setOperator(op);
      setFirstValue(display);
      setSecondaryDisplay(`${display} ${op}`);
      setClearNext(true);
    };

    const handleEqualsClick = () => {
      const num1 = parseFloat(firstValue);
      const num2 = parseFloat(display);
      let result = 0;

      switch (operator) {
        case '+':
          result = num1 + num2;
          break;
        case '-':
          result = num1 - num2;
          break;
        case '*':
          result = num1 * num2;
          break;
        case '/':
          result = num1 / num2;
          break;
        default:
          return;
      }

      setSecondaryDisplay(`${firstValue} ${operator} ${display} =`);
      setDisplay(result.toString());
      setOperator('');
      setFirstValue('');
      setClearNext(true);
    };

    const handleClearClick = () => {
      setDisplay('0');
      setSecondaryDisplay('');
      setOperator('');
      setFirstValue('');
      setClearNext(false);
    };

    const handleBackspace = () => {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay('0');
      }
    };

    const handleScientificOperation = (operation: string) => {
      const currentValue = parseFloat(display);
      let result = 0;
      let opSymbol = '';

      switch (operation) {
        case 'sqrt':
          result = Math.sqrt(currentValue);
          opSymbol = '√';
          break;
        case 'sin':
          result = Math.sin(currentValue * Math.PI / 180);
          opSymbol = 'sin';
          break;
        case 'cos':
          result = Math.cos(currentValue * Math.PI / 180);
          opSymbol = 'cos';
          break;
        case 'tan':
          result = Math.tan(currentValue * Math.PI / 180);
          opSymbol = 'tan';
          break;
        case 'log':
          result = Math.log10(currentValue);
          opSymbol = 'log';
          break;
        case 'squared':
          result = Math.pow(currentValue, 2);
          opSymbol = 'x²';
          break;
        case 'pi':
          result = Math.PI;
          opSymbol = 'π';
          break;
        default:
          return;
      }

      setSecondaryDisplay(`${opSymbol}(${display})`);
      setDisplay(result.toString());
      setClearNext(true);
    };

    // Button component for consistent styling
    const CalcButton = ({
      text,
      action,
      type = 'number',
      span = 1
    }: {
      text: string;
      action: () => void;
      type?: 'number' | 'operator' | 'function' | 'clear';
      span?: number;
    }) => {
      const bgColor = {
        number: '#2a2a2a',
        operator: '#ff9500',
        function: '#505050',
        clear: '#d4d4d2'
      }[type];
      
      const textColor = type === 'clear' ? 'black' : 'white';
      
      return (
        <button
          appearance="primary"
          width={span === 2 ? '48%' : '23%'}
          height="48px"
          onPress={action}
        >
          {text}
        </button>
      );
    };
    
    return (
      <vstack height="100%" width="100%" padding="medium" backgroundColor="#1c1c1c">
        {/* Display Section */}
        <vstack backgroundColor="#1c1c1c" padding="medium" cornerRadius="medium">
          <text size="small" color="#a6a6a6" alignment="end">{secondaryDisplay}</text>
          <text size="xlarge" weight="bold" color="white" alignment="end">{display}</text>
        </vstack>
        <spacer size="medium" />
        
        {/* Calculator Grid */}
        <vstack gap="small">
          {/* Row 1 */}
          <hstack gap="small" alignment="center middle">
            <CalcButton text="AC" action={() => handleClearClick()} type="clear" />
            <CalcButton text="⌫" action={() => handleBackspace()} type="clear" />
            <CalcButton text="π" action={() => handleScientificOperation('pi')} type="function" />
            <CalcButton text="÷" action={() => handleOperatorClick('/')} type="operator" />
          </hstack>
          
          {/* Row 2 */}
          <hstack gap="small" alignment="center middle">
            <CalcButton text="sin" action={() => handleScientificOperation('sin')} type="function" />
            <CalcButton text="cos" action={() => handleScientificOperation('cos')} type="function" />
            <CalcButton text="tan" action={() => handleScientificOperation('tan')} type="function" />
            <CalcButton text="×" action={() => handleOperatorClick('*')} type="operator" />
          </hstack>
          
          {/* Row 3 */}
          <hstack gap="small" alignment="center middle">
            <CalcButton text="√" action={() => handleScientificOperation('sqrt')} type="function" />
            <CalcButton text="x²" action={() => handleScientificOperation('squared')} type="function" />
            <CalcButton text="log" action={() => handleScientificOperation('log')} type="function" />
            <CalcButton text="−" action={() => handleOperatorClick('-')} type="operator" />
          </hstack>
          
          {/* Row 4 */}
          <hstack gap="small" alignment="center middle">
            <CalcButton text="7" action={() => handleNumberClick('7')} />
            <CalcButton text="8" action={() => handleNumberClick('8')} />
            <CalcButton text="9" action={() => handleNumberClick('9')} />
            <CalcButton text="+" action={() => handleOperatorClick('+')} type="operator" />
          </hstack>
          
          {/* Row 5 */}
          <hstack gap="small" alignment="center middle">
            <CalcButton text="4" action={() => handleNumberClick('4')} />
            <CalcButton text="5" action={() => handleNumberClick('5')} />
            <CalcButton text="6" action={() => handleNumberClick('6')} />
            <CalcButton text="=" action={() => handleEqualsClick()} type="operator" />
          </hstack>
          
          {/* Row 6 */}
          <hstack gap="small" alignment="center middle">
            <CalcButton text="1" action={() => handleNumberClick('1')} />
            <CalcButton text="2" action={() => handleNumberClick('2')} />
            <CalcButton text="3" action={() => handleNumberClick('3')} />
            <CalcButton text="%" action={() => handleOperatorClick('%')} type="operator" />
          </hstack>
          
          {/* Row 7 */}
          <hstack gap="small" alignment="center middle">
            <CalcButton text="0" action={() => handleNumberClick('0')} span={2} />
            <CalcButton text="." action={() => handleNumberClick('.')} />
            <CalcButton text="Ans" action={() => {}} type="function" />
          </hstack>
        </vstack>
      </vstack>
    );
  }
});

export default Devvit;
