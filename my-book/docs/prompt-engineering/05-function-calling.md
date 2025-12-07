---
title: "Function Calling and Tool Use"
description: "Enable AI models to interact with external tools and APIs."
keywords:
  - "function calling"
  - "tools"
  - "api integration"
  - "plugins"
---

# Function Calling and Tool Use

## Overview

One of the most powerful capabilities is enabling language models to call external functions. Instead of generating text, models can invoke code, APIs, or tools to accomplish tasks more reliably. This chapter covers how function calling works and how to design effective tool interfaces.

## What is Function Calling?

Function calling means:
- Model recognizes task needs external computation
- Model generates structured request for function call
- System executes function with provided arguments
- Result returned to model for further processing

### Example: Getting Weather

```
USER: "What's the weather in NYC tomorrow?"

Model reasoning:
"User asked about weather.
 I need current weather data.
 I should call weather_forecast function"

Model output:
{
  "function": "get_weather",
  "arguments": {
    "location": "New York, NY",
    "days_ahead": 1
  }
}

System executes: get_weather("New York, NY", 1)
Result: {"temp": 72, "condition": "sunny"}

Model continues:
"The weather in NYC tomorrow will be sunny 
 with a high of 72°F"
```

## Defining Function Interfaces

Good function definitions help models use tools correctly:

### Function Definition Template

```json
{
  "name": "get_weather",
  "description": "Get weather forecast for a location",
  "parameters": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "City name or coordinates"
      },
      "days_ahead": {
        "type": "integer",
        "description": "Number of days in future (0-7)"
      }
    },
    "required": ["location"]
  }
}
```

**Key elements:**
- **name**: What the function is called
- **description**: Purpose and behavior
- **parameters**: Input arguments with types and descriptions
- **required**: Which arguments must be provided

### Robot Instruction Example

```json
{
  "name": "move_gripper",
  "description": "Move robot gripper to specified position",
  "parameters": {
    "type": "object",
    "properties": {
      "x": {
        "type": "number",
        "description": "X position in meters (-2 to 2)"
      },
      "y": {
        "type": "number",
        "description": "Y position in meters (-2 to 2)"
      },
      "z": {
        "type": "number",
        "description": "Z position in meters (0 to 3)"
      },
      "speed": {
        "type": "string",
        "enum": ["slow", "normal", "fast"],
        "description": "Movement speed"
      }
    },
    "required": ["x", "y", "z"]
  }
}
```

## Enabling Function Calling in Practice

### Using OpenAI's Function Calling

```python
import openai

# Define available functions
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather forecast",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {"type": "string"},
                    "days": {"type": "integer"}
                },
                "required": ["location"]
            }
        }
    }
]

# Make request
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[{"role": "user", 
               "content": "What's the weather in Boston?"}],
    tools=tools,
    tool_choice="auto"  # Let model decide when to call
)

# Check if model wants to call a function
if response.tool_calls:
    for call in response.tool_calls:
        func_name = call.function.name
        func_args = json.loads(call.function.arguments)
        
        # Execute the function
        if func_name == "get_weather":
            result = get_weather(**func_args)
            
        # Send result back to model
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": original_question},
                {"role": "assistant", "content": str(response)},
                {"role": "tool", "content": json.dumps(result),
                 "tool_call_id": call.id}
            ]
        )

print(response.choices[0].message.content)
```

## Real-World Examples

### Example 1: Calculator Tool

```
User: "What is 127 × 483 + 95?"

Model thinks: "I should use calculator for accuracy"

Function call:
{
  "function": "multiply",
  "arguments": {"a": 127, "b": 483}
}

Result: 61341

Function call:
{
  "function": "add",
  "arguments": {"a": 61341, "b": 95}
}

Result: 61436

Response: "127 × 483 + 95 = 61436"
```

### Example 2: Code Execution Tool

```
User: "How many Fibonacci numbers are less than 1000?"

Model thinks: "I should write and run code to solve this"

Function call:
{
  "function": "execute_python",
  "arguments": {
    "code": "
fibs = [1, 1]
while fibs[-1] + fibs[-2] < 1000:
    fibs.append(fibs[-1] + fibs[-2])
print(len(fibs))
"
  }
}

Result: 16

Response: "There are 16 Fibonacci numbers less than 1000"
```

## Designing Tool Use Systems

### Tool Composition

Chain multiple tools to solve complex problems:

```
Task: "Analyze competitor's website traffic"

Tools available:
├─ fetch_webpage(url) → HTML content
├─ analyze_text(content) → Key insights
├─ search_web(query) → Links
└─ get_historical_data(url) → Traffic history

Process:
1. Use search_web to find competitors
2. Use fetch_webpage for each competitor
3. Use analyze_text for key info
4. Use get_historical_data for trends
5. Combine results into analysis
```

### Error Handling in Tool Use

Not all function calls succeed:

```python
def call_function_safely(func_name, args):
    try:
        if func_name == "get_weather":
            if not -180 <= args["longitude"] <= 180:
                return {"error": "Invalid longitude"}
            return get_weather(**args)
        else:
            return {"error": f"Unknown function: {func_name}"}
    except Exception as e:
        return {"error": str(e)}

# Tell model about error and let it retry
error_result = call_function_safely("get_weather", 
                                    {"location": "NYC"})
if "error" in error_result:
    # Send error back to model for retry
    # Model can try different approach
    pass
```

### Tool Result Format

Return results in consistent format:

```
Good result format:
{
  "success": true,
  "data": {...},
  "timestamp": "2024-01-15T10:30:00Z"
}

Bad result when error:
{
  "error": "Location not found",
  "suggestion": "Try 'New York' instead of 'NYC'"
}
```

Consistent format helps model understand and process results.

## Advanced: Parallel Tool Calling

Models can call multiple tools simultaneously:

```
User: "Compare weather and flight prices for NYC, Miami, 
       and LA tomorrow"

Model calls (all at once):
- get_weather("NYC", 1)
- get_weather("Miami", 1)  
- get_weather("LA", 1)
- get_flights("NYC", tomorrow)
- get_flights("Miami", tomorrow)
- get_flights("LA", tomorrow)

Results returned together, model synthesizes:
"NYC: Sunny, 72°F, cheapest flights ($120)
 Miami: Rainy, 85°F, moderate flights ($180)
 LA: Clear, 68°F, most expensive ($220)"
```

## Tool Use for Robotics

### Defining Robot Actions as Tools

```json
{
  "name": "grasp_object",
  "description": "Grasp object at specified position",
  "parameters": {
    "type": "object",
    "properties": {
      "object_id": {
        "type": "string",
        "description": "Identifier of object to grasp"
      },
      "grasp_force": {
        "type": "number",
        "description": "Force in Newtons (min:1, max:100)"
      }
    },
    "required": ["object_id", "grasp_force"]
  }
}
```

This allows language models to understand and execute robotic actions directly.

## Summary

Function calling and tool use:

1. **Extend capability**: Models can leverage external computation
2. **Improve accuracy**: Math, logic, real-time data
3. **Enable integration**: Connect AI to databases, APIs, hardware
4. **Support composition**: Chain multiple tools for complex tasks
5. **Provide feedback**: Results guide model's next steps

Properly designed tool interfaces make AI systems far more powerful and reliable than text generation alone.

---

**Previous:** [Chain-of-Thought Reasoning](./04-chain-of-thought.md) | **Next:** [Prompt Optimization](./06-prompt-optimization.md)
