import React from 'react';

function AddMessage(): JSX.Element {
    return (
        <div>
            <form>
                <label>
                    Insert new message here:
                    <input type="text" name="name" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default AddMessage;
